const ToTop = () => {
  const toTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  return (
    <button onClick={toTop} className="h-12 w-12 text-2xl cursor-pointer">
      ⬆️️
    </button>
  );
};
export default ToTop;
