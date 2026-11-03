import './globals.css';
export const metadata={title:'STELLAR QUEST | Fan RPG Prototype',description:'비공식 팬메이드 2D 턴제 RPG 프로토타입',manifest:'/manifest.json'};
export const viewport={width:'device-width',initialScale:1,maximumScale:1,userScalable:false,viewportFit:'cover',themeColor:'#0b1020'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ko"><body>{children}</body></html>}
