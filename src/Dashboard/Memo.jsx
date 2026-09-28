// import React, { useMemo, useState } from "react";

// function Memo() {
// //   const [search, setSearch] = useState("");
// //   const [count, setCount] = useState(0);

// //   const products = [
// //     "Coffee",
// //     "Tea",
// //     "Latte",
// //     "Cappuccino",
// //     "Cake",
// //     "Cookie",
// //   ];

// //   const filteredProducts = useMemo(() => {
// //     console.log("Filtering...");

// //     return products.filter((product) =>
// //       product.toLowerCase().includes(search.toLowerCase())
// //     );
// //   }, [search]);

// const [cart, setCart] = {
    
// }

//   return (
//     <div>
//       {/* <h2>Product Search</h2>

//       <input
//         type="text"
//         placeholder="Search product..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//       />

//       <button onClick={() => setCount(count + 1)}>
//         Count: {count}
//       </button>

//       <ul>
//         {filteredProducts.map((product, index) => (
//           <li key={index}>{product}</li>
//         ))}
//       </ul> */}

//       <h1>Count</h1>
      
//       <div className="group" style={{display: "flex", gap : "30px"}}>
//         <button>-</button>
//       <button>+</button>
//       </div>
//     </div>
//   );
// }

// export default Memo;

// import React, { useState, useMemo } from "react";

// function Memo() {
//   const [price, setPrice] = useState(100);
//   const [quantity, setQuantity] = useState(2);
//   const [count, setCount] = useState(0);

//   const total = useMemo(() => {
//     console.log("Calculate running...");

//     return price * quantity * count;
//   }, [price, quantity,count]);

//   return (
//     <div>
//       <h2>Price: {price}</h2>
//       <h2>Quantity: {quantity}</h2>
//       <h2>Total: {total}</h2>
//       <h2>Count : {count}</h2>

//       <button onClick={() => setPrice(price + 100)}>
//         Increase Price
//       </button>

//       <button onClick={() => setQuantity(quantity + 1)}>
//         Increase Quantity
//       </button>

//       <button onClick={() => setCount(count + 1)}>
//         Count
//       </button>
//     </div>
//   );

//     const ChildBtn = React.memo(({onClick}) => {
//         console.log("child memo");
//         return <button onClick={onClick}>Click</button>;
//     });

//     function Memo() {
//         const [count, setCount] = useState(0);

//         const handleClick = useCallback (() => {
//             console.log("Child Btn Click");
            
//         },[]);

//         return(
//             <>
//             <p>Count : {count}</p>
//             <button onClick={() => setCount( count + 1 )}>Increment Count</button>
//             <ChildBtn onClick={handleClick}/>
//             </>

//         )
//     }

// export default Memo;

import React, { useCallback, useState } from "react";

const ChildBtn = React.memo(({ onClick }) => {
  console.log("child memo");

  return <button onClick={onClick}>Click</button>;
});

function Memo() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("Child Btn Click");
  }, []);

  return (
    <>
      <p>Count : {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increment Count
      </button>

      <ChildBtn onClick={handleClick} />
    </>
  );
}

export default Memo;