import { useNavigate } from "react-router-dom";

export const useDelayedNavigate = () => {
  const navigate = useNavigate();
  const delayedNavigate = (setLoadEffect, path) => {
    setLoadEffect(true);
    setTimeout(() => {
      setLoadEffect(false);
      navigate(path);
    }, 1000);
  };
  return delayedNavigate;
};
