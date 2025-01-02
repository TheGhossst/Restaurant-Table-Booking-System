export function Error({ message }: { message: string }) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-red-500 text-center bg-red-100 p-6 rounded-md max-w-md">
                <h2 className="text-xl font-bold mb-2">Error</h2>
                <p>{message}</p>
            </div>
        </div>
    )
}

export function NotFound({ item }: { item: string }) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="text-center bg-gray-100 p-6 rounded-md max-w-md">
                <h2 className="text-xl font-bold mb-2">Not Found</h2>
                <p>{item} not found</p>
            </div>
        </div>
    )
}