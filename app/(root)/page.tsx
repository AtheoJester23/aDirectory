import StartupCard, { StartupTypeCard } from "@/components/StartupCard";
import SearchForm from "../../components/SearchForm";
import { STARTUPS_QUERY } from "@/sanity/lib/queries";
import { SanityLive } from "@/sanity/lib/live";
import { client } from "@/sanity/lib/client";

export default async function Home({searchParams}: {
  searchParams: Promise<{query ?: string}>
}) {

  const query = (await searchParams).query

  const params = {search: query || null}

  // live data fetching
  // const {data: posts} = await sanityFetch({query: STARTUPS_QUERY, params});

  // not live data fetching:
  const posts = await client.fetch(STARTUPS_QUERY, params)

  // temporary data
  // const posts = [
  //   {
  //     _createdAt: new Date(),
  //     views: 55,
  //     author: {_id: 1, name: "Somebody"},
  //     _id: 1,
  //     description: "Testing description only...",
  //     image: "https://images.unsplash.com/photo-1627773755683-dfcf2774596a?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     category: "Music",
  //     title: "Music Producing"
  //   },{
  //     _createdAt: new Date(),
  //     views: 25,
  //     author: {_id: 2, name: "Atheo"},
  //     _id: 2,
  //     description: "Only a Testing description",
  //     image: "https://images.unsplash.com/photo-1627773755683-dfcf2774596a?q=80&w=1452&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  //     category: "Music",
  //     title: "Music Producing"
  //   }
  // ]


  return (
    <>
      <section className="heading_container">
      
        <h1 className="heading">Dreams in draft — discover them first.</h1>
      
        <p className="sub-heading !max-w-3xl">
          Submit Ideas, Vote on Pitches, and Get Noticed in Virtual Competitions.
        </p>

        <SearchForm query={query}/>
      </section>

      <section className="section_container">
        <p className="font-semibold text-[30px] text-white">
          {query ? `Search results for "${query}"` : 'All Startups'}
        </p>

        <ul className="mt-7 card_grid">
          {posts?.length > 0 ? (
            posts.map((item: StartupTypeCard) => (
              <StartupCard key={item?._id} prop={item}/>
            ))
          ) : (
            <p className="no-result text-white">That startup don&apos;t exist yet...</p>
          )}
        </ul>
      </section>

      <SanityLive/>
    </>
  );
}
