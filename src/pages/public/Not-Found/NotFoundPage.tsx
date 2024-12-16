import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const NotFoundPage = () => {
  const [counter, setCounter] = useState(5);
  const navigate = useNavigate(); // Hook para redirección programática

  useEffect(() => {
    if (counter === 0) {
      navigate("/home");
    } else {
      const timer = setTimeout(() => {
        setCounter((prevCounter) => prevCounter - 1);
      }, 1000);

      return () => clearTimeout(timer); // clean the timer in the cleaning effect to avoid memory leaks
    }
  }, [counter]);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "white",
          width: "100%",
          height: "100vh",
        }}
      >
        <h2
          style={{
            backgroundColor: "red",
            color: "white",
            padding: 20,
            textAlign: "center",
            width: "100%",
          }}
        >
          Error &lt;404&gt; Not found
        </h2>
        <h4 style={{ color: "black" }}>return {counter}...</h4>
      </div>
    </>
  );
};

export default NotFoundPage;
