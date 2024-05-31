import { Publication } from './Publication'
// this file will show up only if there's any publication acepted in db
export const PublicationList = ({ publications }) => {
  return (
    <section className="grid grid-cols-1 gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 md:p-6 lg:grid-cols-4">
      {publications.map((publication, index) => (
        <Publication key={index} publication={publication} />
      ))}
    </section>
  )
}
