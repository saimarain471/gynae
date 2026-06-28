export default function BlogSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-44 bg-gray-200" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-5 w-20 bg-gray-200 rounded-full" />
        <div className="h-5 w-full bg-gray-200 rounded" />
        <div className="h-5 w-4/5 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-3/4 bg-gray-100 rounded" />
        <div className="flex justify-between mt-1">
          <div className="h-3 w-24 bg-gray-100 rounded" />
          <div className="h-3 w-16 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  )
}
