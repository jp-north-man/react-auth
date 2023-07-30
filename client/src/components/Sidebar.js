import React from "react";

const Sidebar = () => {
  return (
    <aside className="bg-white text-black w-64 min-h-screen border-r border-gray-200">
      <div className="h-14 border-b border-gray-200 px-4 flex items-center mb-1">
        Sidebar
      </div>
      <ul>
        <li className="mx-1 mb-1 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <p>コンテンツ1</p>
        </li>
        <li className="mx-1 mb-1 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <p>コンテンツ2</p>
        </li>
        <li className="mx-1 mb-1 p-2 hover:bg-gray-100 rounded-lg cursor-pointer">
          <p>コンテンツ3</p>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
