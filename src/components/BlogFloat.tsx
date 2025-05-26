import type React from "react"
import FlotTOC from "./FloatTOC"
import type { MarkdownHeading } from "astro"
import ToTop from "./ToTop"
import BlogBack from "./BlogBack"

const BlogFloat:React.FC<{
    headings:MarkdownHeading[]
}>= ({headings}) =>{
    return (
        <div className="fixed bottom-8 right-1 p-4 z-50">
            <BlogBack/>
            <FlotTOC headings={headings}/>
            <ToTop/>
        </div>
    )
}

export default BlogFloat