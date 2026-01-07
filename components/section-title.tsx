export default function SectionTitle({ title }: { title: string }){
    return(
        <div className="col-span-full mt-6 mb-4">
            <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2">
                {title}
            </h3>
        </div>
    )
}