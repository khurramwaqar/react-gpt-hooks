import { GptProvider } from 'react-gpt-hooks';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <GptProvider
          options={{
            singleRequest: true,
            collapseEmptyDivs: true,
          }}
        >
          {children}
        </GptProvider>
      </body>
    </html>
  );
}
