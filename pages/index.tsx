import { useEffect, useState } from "react";

const Endpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(Endpoint)
  const data = await res.json();
  return {
    props: {
      data
    }
  }
}
export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data
  const [results, setResults] = useState(defaultResults)
  const [page, setPage] = useState({
    ...info,
    current: Endpoint
  });
  const { current } = page;
  const [pagestart, setPagestart] = useState(1)
  const allpage = Array(42).fill(pagestart).map((e, i) => i + 1)

  useEffect(() => {
    if (current === Endpoint) return;

    async function request() {
      const res = await fetch(current)
      const nextData = await res.json();
      if (current.split('=')[1]) {
        setPagestart(current.split("=")[1])
      }
      setPage({
        current,
        ...nextData.info
      });

      if (!nextData.info?.prev) {
        setResults(nextData.results);
        return;
      }

      setResults(() => {
        return [
          ...nextData.results
        ]
      });
    }

    request();
  }, [current]);

  function handleLoadNext() {
    setPage(() => {
      return {
        current: page?.next
      }
    });
  }

  function handleLoadPrev() {
    setPage(() => {
      return {
        current: page?.prev
      }
    });
  }


  return (
    <div className="mx-10">
      <h1 className="flex justify-center font-bold">Rick And Morty Characters</h1>
      <div className="border flex flex-wrap gap-4 justify-evenly font-bold">
        {results.map((item: { id: any; name: any; image: any; }, index: any) => {
          const { id, name, image } = item
          return <div key={`item+${index}`}>
            <img src={image} alt={`${name} Thumbnail`} />
            <h3 className="flex justify-center">{name}</h3>
          </div>
        })}
      </div>
      <div className="border flex gap-4 justify-evenly">
        <button onClick={handleLoadPrev} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 my-2 rounded">prev</button>
        <div className="flex gap-10 overflow-x-scroll">
          {allpage.map((ele, index) => {
            return <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 my-2 rounded" key={`page-${index}`} onClick={() => {
              setPage(() => {
                return {
                  current: Endpoint + `?page=${ele}`
                }
              })
              setPagestart(ele)
            }}>{ele}</div>
          })}
        </div>
        <button onClick={handleLoadNext} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 my-2 rounded">next</button>
      </div>
    </div >
  )
}

