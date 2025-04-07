'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
  SelectSeparator
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Suspense, useRef, type MouseEventHandler } from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { fetchColors, type ReturnedColors } from "./utils";
import { useRouter,  useSearchParams } from "next/navigation";
import { CiLight, CiDark } from "react-icons/ci";
import { FaRegCopy } from "react-icons/fa";

type OnValueChangeHandler = (value: string) => void;

import { useCopyToClipboard } from "@uidotdev/usehooks";

    const queryClient = new QueryClient()

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>

    <Suspense fallback={<p>loading</p>}>
      <Header />
      <Main/>
     </Suspense>
    </QueryClientProvider>
  );
}


function ButtonOutline({children, ...rest}: Button) {
  return <Button variant="outline" className="border-gray-400 dark:text-white dark:bg-slate-600 justify-self-center col-span-1 md:justify-self-stretch md:col-span-1 " {...rest}>{children}</Button>
}


function useColors(color: string, mode: string){
  return useQuery<ReturnedColors>({
    queryKey: ['color', color, mode],
    queryFn: () => fetchColors(mode, color),
    staleTime: Number.POSITIVE_INFINITY,
    enabled: !!color && !!mode 
  })
}

function Header(){
  const router = useRouter()
  const searchParams = useSearchParams()
  const colorRef = useRef<HTMLInputElement>(null)
  const theme =  searchParams.get('theme') || 'dark' 
  console.log(theme)
  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    const theme = searchParams.get('theme') || 'dark'
    if (!colorRef.current) return
    const color = colorRef.current.value;
    const mode = searchParams.get('mode') || 'monochrome'
    router.push(`?color=${color.substring(1)}&mode=${mode}&theme=${theme}`, {
      scroll: false,
    })
  }

  const handleChange: OnValueChangeHandler = (value) => {
    const theme = searchParams.get('theme') || 'dark'
    const color = searchParams.get('color') || 'fff'
    router.push(`?color=${color}&mode=${value}&theme=${theme}`, {
      scroll: false,
    })
  }

  const handleTheme: MouseEventHandler<HTMLButtonElement> = () => {
    const html = document.getElementsByTagName('html')[0]
    let theme = html.getAttribute('data-theme') || 'dark'
    theme = theme === 'dark' ? 'light' : 'dark'
    html.setAttribute('data-theme', theme)

    const color = searchParams.get('color')
    const mode = searchParams.get('mode') || 'monochrome'
    router.push(`?color=${color}&mode=${mode}&theme=${theme}`, {
      scroll: false,
    })
  }

  return (
      <header className="w-full dark:bg-slate-800 mx-auto grid h-22 gap-2 justify-items-center justify-center items-center md:grid-cols-[min-content_1fr_max-content_max-content] max-w-130">
          <input defaultValue={`#${searchParams.get("color")}` || 'fff'} ref={colorRef} type="color" name="color" className="size-10 row-start-1 col-start-1  md:justify-self-start" />
          <Select onValueChange={handleChange}>
            <SelectTrigger className="md:justify-self-center row-start-1 w-full dark:bg-slate-800 dark:text-white text-gray-900 border rounded-md border-gray-400 dark:border-white py-2">
              <SelectValue placeholder="Choose color mode" />
            </SelectTrigger>
            <SelectContent className='dark:bg-slate-800 bg-white'>
              <SelectGroup>
                <SelectLabel className="text-lg dark:text-white text-gray-950 font-medium">Color Scheme</SelectLabel>
                <SelectItem  className='focus:bg-blue-500 dark:text-white text-gray-900' value="monochrome">Monochrome</SelectItem>
                <SelectItem className='focus:bg-blue-500 dark:text-white text-gray-900' value="monochrome-dark">Monochrome dark</SelectItem>
                <SelectItem className='focus:bg-blue-500 dark:text-white text-gray-900' value="monochrome-light">Monochrome light</SelectItem>
                <SelectSeparator className="h-[1px] bg-black w-full"/>
                <SelectItem className='focus:bg-blue-500 dark:text-white text-gray-900' value="analogic">Analogic</SelectItem>
                <SelectItem className='focus:bg-blue-500 dark:text-white text-gray-900' value="complement">Complement</SelectItem>
                <SelectItem className='focus:bg-blue-500 dark:text-white text-gray-900' value="analogic-complement">Analogic complement</SelectItem>
                <SelectSeparator className="h-[1px] bg-black w-full"/>
                <SelectItem className='focus:bg-blue-500 dark:text-white text-gray-900' value="triad">Triad</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <ButtonOutline onClick={handleClick} >Get color scheme</ButtonOutline>
          <Button className="justify-self-end col-span-1 row-span-1" onClick={handleTheme}>{theme ==='light' ? <CiLight className="size-8 " /> : <CiDark className="border-gray-400 bg-slate-600 border size-8 rounded-md" />}</Button>
        </header>
  )
}
function Main(){
  const copyToClipboard = useCopyToClipboard()[1];
  const searchParams = useSearchParams()
  const color = (searchParams.get('color') as string)
  const mode = searchParams.get('mode') as string
  
  const {data, status, isLoading, isFetching, isError} = useColors(color, mode)
  if(isLoading || isFetching){
    return <Wrapper><p className="col-span-5 justify-self-center self-center animate-loading">loading</p></Wrapper>
  }
  if(isError){
    return <Wrapper><p className="col-span-5 justify-self-center self-center">Error</p></Wrapper>
  }
  if(status === 'success'){
			const elements = data.colors.map((color, index) => (
        <div className="dark:bg-slate-800 w-full  dark:text-white grid grid-rows-[1fr_auto_auto]" tabIndex={index} onKeyUp={()=> copyToClipboard(color.hsl.value)} key={color.hex.value} onClick={()=>copyToClipboard(color.hsl.value)}>
          <div
            
            className='row-span-1 '
            style={{
              backgroundColor: color.hsl.value
            }}
          />
          <p className="row-span-1 max-w-[8ch] py-2 text-sm text-wrap text-center mx-auto">{color.hex.value}</p>
          <FaRegCopy className="row-span-1 mx-auto pb-2 text-2xl" />
        </div>
			));
      console.log(elements)
			return <Wrapper>{elements}</Wrapper>;
		}
    return <Wrapper><p  className="col-span-5 justify-self-center self-center">Search for a color</p></Wrapper>
}


function Wrapper({children}: React.ComponentPropsWithoutRef<'section'>){
  return (
      <section className="mx-auto grid grid-cols-5  w-full max-w-130 h-full dark:bg-slate-800">
        {children}
      </section>
  )
}