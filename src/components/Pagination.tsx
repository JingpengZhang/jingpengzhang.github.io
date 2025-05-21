import type React from "react";
import type { HTMLAttributes } from "react";

const Pagination: React.FC<{
  current: number;
  total: number;
  totalPages: number;
  onChange: (page: number) => void;
}> = ({ current, total, totalPages, onChange }) => {
  const prev = () => {
    if (current > 1) {
      onChange(current - 1);
    }
  };

  const next = () => {
    if (current < totalPages) {
      onChange(current + 1);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <Button disabled={current <= 1} onClick={prev}>
        上一页
      </Button>
      <Button disabled={current >= totalPages} onClick={next}>
        下一页
      </Button>
    </div>
  );
};

export default Pagination;
const Button: React.FC<
  React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
> = (props) => {
  return (
    <button
      {...props}
      className="rounded-lg bg-gray-800 cursor-pointer h-9 text-sm flex items-center justify-center px-4 shadow hover:bg-gray-700 active:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-700 disabled:cursor-not-allowed"
    >
      {props.children}
    </button>
  );
};
