import React,{useEffect} from "react";


const NotFound = () => {
    useEffect(() => {
      document.title = "NotFound-Blog_App";
    }, []);
  return (
    <div className="bg-gray-background">
        <div className="mx-auto max-w-screen-lg">
            <p className="text-center text-2xl">
                Not Found Page
            </p>
        </div>
    </div>
  )
};

export default NotFound;
