import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: [],
    token: "",
  });

  const handleDelete = async (id) => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-post/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: auth?.token,
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        toast.success(dataFromResponse?.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    let getAuth = localStorage.getItem("job-auth");
    if (getAuth) {
      let parseUser = JSON.parse(getAuth);
      setAuth({
        user: parseUser?.loginData,
        token: parseUser.token,
      });
    }
  }, [auth?.user?._id]);

  return (
    <AppContext.Provider value={{ auth, setAuth }}>
      {children}
    </AppContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useGlobalContext };
