import dynamic from 'next/dynamic';
 
const NoSSR = dynamic(() => import('./Recommendations'), { ssr: false })
 
export default function Page() {
  return (
    <div>
      <NoSSR />
    </div>
  )
}
