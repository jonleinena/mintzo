import { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

interface MermaidDiagramProps {
  chart: string;
  height?: number;
  theme?: 'dark' | 'default';
}

function buildHtml(chart: string, theme: string): string {
  // Escape backticks, backslashes, and ${} in the chart string for safe template literal embedding
  const escaped = chart.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');

  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: ${theme === 'dark' ? '#000000' : '#ffffff'};
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      overflow: hidden;
    }
    #diagram {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #diagram svg {
      max-width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div id="diagram"></div>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
    mermaid.initialize({
      startOnLoad: false,
      theme: '${theme}',
      securityLevel: 'strict',
      mindmap: {
        padding: 16,
        useMaxWidth: true,
      },
    });
    try {
      const { svg } = await mermaid.render('mermaid-svg', \`${escaped}\`);
      document.getElementById('diagram').innerHTML = svg;
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'rendered' }));
    } catch (err) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message }));
    }
  </script>
</body>
</html>`;
}

export function MermaidDiagram({ chart, height = 300, theme = 'dark' }: MermaidDiagramProps) {
  const [isLoading, setIsLoading] = useState(true);
  const html = buildHtml(chart, theme);

  return (
    <View style={{ height, width: '100%' }}>
      {isLoading && (
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={theme === 'dark' ? '#ffffff' : '#000000'} />
        </View>
      )}
      <WebView
        source={{ html }}
        style={{ flex: 1, backgroundColor: 'transparent' }}
        scrollEnabled={false}
        javaScriptEnabled
        originWhitelist={['*']}
        onMessage={(event) => {
          try {
            const data = JSON.parse(event.nativeEvent.data);
            if (data.type === 'rendered') {
              setIsLoading(false);
            } else if (data.type === 'error') {
              console.error('Mermaid render error:', data.message);
              setIsLoading(false);
            }
          } catch {
            // Ignore parse errors
          }
        }}
      />
    </View>
  );
}
