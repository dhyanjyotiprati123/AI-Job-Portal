import JobCard from "./JobCard";

export default function JobsGrid({ jobs }) {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <JobCard key={job._id} job={job} />
      ))}
    </section>
  );
}
