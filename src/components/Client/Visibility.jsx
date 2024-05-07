export const RenderVisibility = ({ show, handleClick }) => {
  return (
    <>
      {!show ? (
        <span
          onClick={handleClick}
          className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-acchtmlForeground absolute bottom-1 right-1 inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-white">visibility</span>
        </span>
      ) : (
        <span
          onClick={handleClick}
          className="ring-offset-background focus-visible:ring-ring hover:bg-accent hover:text-acchtmlForeground absolute bottom-1 right-1 inline-flex h-7 w-7 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none
          disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-white">visibility_off</span>
        </span>
      )}
    </>
  )
}
