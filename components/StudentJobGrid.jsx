
import StudentJobCard from "./StudentJobCard"

const StudentJobGrid = ({jobs}) => {
  return (
    <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {
        jobs?.map((job) => <StudentJobCard key={job._id} job={job} />)
        }
    </div>
  )
}

export default StudentJobGrid