import { handleCors, jsonResponse, errorResponse } from '../_shared/cors.ts';
import { createSupabaseClient, createSupabaseAdmin, getUserId } from '../_shared/supabase.ts';

interface GenerateImagesRequest {
  contentId: string;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/images/generations';

Deno.serve(async (req: Request) => {
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const authHeader = req.headers.get('Authorization');
    const supabase = createSupabaseClient(authHeader);
    const userId = await getUserId(supabase);

    if (!userId) {
      return errorResponse('Unauthorized', 401);
    }

    const { contentId } = await req.json() as GenerateImagesRequest;

    if (!contentId) {
      return errorResponse('Missing contentId');
    }

    // Fetch the Part 2 content
    const { data: content, error: fetchError } = await supabase
      .from('exam_part2_content')
      .select('id, level, topic, prompt_text, comparison_points, image_urls')
      .eq('id', contentId)
      .single();

    if (fetchError || !content) {
      return errorResponse('Content not found', 404);
    }

    // Skip if images already exist and are real URLs (not placeholders)
    if (content.image_urls?.length > 0 && content.image_urls[0].startsWith('http')) {
      return jsonResponse({
        message: 'Images already exist',
        imageUrls: content.image_urls,
      });
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      return errorResponse('OpenAI API key not configured', 500);
    }

    // Generate 2 images based on the topic and comparison points
    const points = content.comparison_points ?? [];
    const imagePrompts = [
      `A realistic photograph for a Cambridge English exam showing: ${content.topic}. Focus on: ${points.slice(0, 2).join(', ')}. The image should be clear, well-lit, and suitable for exam comparison discussion. No text or labels in the image.`,
      `A realistic photograph for a Cambridge English exam showing: ${content.topic}. Focus on: ${points.slice(2, 4).join(', ') || points.slice(0, 2).join(', ')} but from a contrasting perspective. The image should be clear, well-lit, and suitable for exam comparison discussion. No text or labels in the image.`,
    ];

    const admin = createSupabaseAdmin();
    const uploadedUrls: string[] = [];

    for (let i = 0; i < imagePrompts.length; i++) {
      // Generate image with DALL-E 3
      const dalleResponse = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: imagePrompts[i],
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'b64_json',
        }),
      });

      if (!dalleResponse.ok) {
        const errorText = await dalleResponse.text();
        console.error(`DALL-E error for image ${i + 1}:`, errorText);
        continue;
      }

      const dalleResult = await dalleResponse.json();
      const b64Image = dalleResult.data?.[0]?.b64_json;

      if (!b64Image) {
        console.error(`No image data returned for image ${i + 1}`);
        continue;
      }

      // Decode and upload to storage
      const binaryString = atob(b64Image);
      const bytes = new Uint8Array(binaryString.length);
      for (let j = 0; j < binaryString.length; j++) {
        bytes[j] = binaryString.charCodeAt(j);
      }

      const storagePath = `part2-photos/${content.level}/${content.topic}/${contentId}-${i + 1}.png`;

      const { error: uploadError } = await admin.storage
        .from('exam-content')
        .upload(storagePath, bytes, {
          contentType: 'image/png',
          upsert: true,
        });

      if (uploadError) {
        console.error(`Storage upload failed for image ${i + 1}:`, uploadError);
        continue;
      }

      const { data: urlData } = admin.storage
        .from('exam-content')
        .getPublicUrl(storagePath);

      uploadedUrls.push(urlData.publicUrl);
    }

    if (uploadedUrls.length === 0) {
      return errorResponse('Failed to generate any images', 500);
    }

    // Update the content row with new image URLs
    const { error: updateError } = await admin
      .from('exam_part2_content')
      .update({ image_urls: uploadedUrls })
      .eq('id', contentId);

    if (updateError) {
      console.error('Failed to update image_urls:', updateError);
      return errorResponse('Images generated but failed to update database', 500);
    }

    return jsonResponse({
      generated: uploadedUrls.length,
      imageUrls: uploadedUrls,
    });
  } catch (error) {
    console.error('Image generation error:', error);
    return errorResponse(`Failed to generate images: ${(error as Error).message}`, 500);
  }
});
