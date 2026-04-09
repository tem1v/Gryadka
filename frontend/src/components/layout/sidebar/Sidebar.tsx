interface Props {
  name?: string;
  location?: string;
};

export function Sidebar({name, location}: Props) {
  return <aside className="w-97.5 p-2.5">
    <div className='bg-white w-full h-full'></div>
  </aside>
};