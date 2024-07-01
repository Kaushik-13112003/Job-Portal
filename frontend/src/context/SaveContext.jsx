import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const SaveContext = createContext();

const SaveProvider = ({ children }) => {
  const [saveJob, setSaveJob] = useState([]);
  const [jobId, setJobId] = useState([]);

  const saveJobFunction = async (job) => {
    let job_id = job._id;
    let isSaved = jobId.includes(job_id);

    if (!isSaved) {
      setSaveJob([...saveJob, job]);
      setJobId([...jobId, job_id]);
      localStorage.setItem("savejob", JSON.stringify([...saveJob, job]));
      localStorage.setItem("savejobID", JSON.stringify([...jobId, job_id]));
      toast.success("job added to your interest");
    } else {
      let filterJobs = saveJob.filter((j) => {
        return j._id !== job_id;
      });
      setSaveJob(filterJobs);
      let filterJobsId = jobId.filter((jid) => {
        return jid !== job_id;
      });
      setJobId(filterJobsId);
      localStorage.setItem("savejob", JSON.stringify(filterJobs));
      localStorage.setItem("savejobID", JSON.stringify(filterJobsId));
      toast.success("job removed from your interest");
    }
  };

  useEffect(() => {
    let isExistsJob = localStorage.getItem("savejobID");
    let isExistsJobData = localStorage.getItem("savejob");

    if (isExistsJob) {
      setJobId(JSON.parse(isExistsJob));
      setSaveJob(JSON.parse(isExistsJobData));
    }
  }, []);

  return (
    <SaveContext.Provider
      value={{ saveJob, jobId, setSaveJob, saveJobFunction }}
    >
      {children}
    </SaveContext.Provider>
  );
};

const useSaveContext = () => {
  return useContext(SaveContext);
};

export { SaveProvider, useSaveContext };
