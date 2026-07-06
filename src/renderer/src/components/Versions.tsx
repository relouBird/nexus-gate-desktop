import { useState } from 'react'

function Versions(): React.JSX.Element {
  const [versions] = useState(window.electron.process.versions)

  const items = [
    {
      name: 'Electron',
      version: versions.electron
    },
    {
      name: 'Chromium',
      version: versions.chrome
    },
    {
      name: 'Node.js',
      version: versions.node
    }
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4">
      {items.map((item) => (
        <div
          key={item.name}
          className="min-w-40 rounded-xl border border-slate-700 bg-slate-800/60 p-4 shadow-md transition-all hover:border-blue-500 hover:shadow-lg"
        >
          <p className="text-sm font-medium text-slate-400">{item.name}</p>
          <p className="mt-1 text-xl font-bold text-white">v{item.version}</p>
        </div>
      ))}
    </div>
  )
}

export default Versions
