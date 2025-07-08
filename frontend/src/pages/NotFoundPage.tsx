import { NoSymbolIcon } from '@heroicons/react/24/solid'

const NotFoundPage = () => {
    return (
        <div className="">
            <NoSymbolIcon className="w-24 h-24 mx-auto text-gray-500 mt-20" />
            <h1 className="text-2xl font-bold text-center mt-4">404 - Page Not Found</h1>
        </div>
    )
};

export default NotFoundPage;