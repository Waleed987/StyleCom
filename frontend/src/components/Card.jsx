import { useNavigate } from "react-router-dom";

function Card({item}){
    const navigate = useNavigate();

    const handleCardClick = () => {
        console.log("this is item id" + item._id);
        navigate(`/product/${item._id}`);
    };

    return(
        <>
            <div 
                className="flex flex-col justify-center items-center pt-2 px-2 h-110 w-60 transition-all duration-75 hover:border m-4 cursor-pointer hover:shadow-lg"
                onClick={handleCardClick}
            >
                <div className="h-85 w-[98%]">
                    <img src={item?.imageUrl || "/hero.webp"} alt={item?.productName || "Product"} className="h-full w-full object-cover" />
                </div>
                <div className="px-4 py-2 h-15 w-full  text-center break-words font-serif">
                    <p>{item?.productName || "Product Name"}</p>
                </div>
                <div className="h-10 w-full pt-1 text-center">
                    <p>Rs. {item.price.toLocaleString()}</p>
                </div>      
            </div>
        </>
    )
}

export default Card;
