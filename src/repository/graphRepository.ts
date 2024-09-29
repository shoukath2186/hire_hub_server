import UserModel from "../frameworks/models/userModel";
import JobModel from "../frameworks/models/JobModel";

import ApplicationModel from "../frameworks/models/applicationModel";

class GraphRepository {

    async createGarphData() {

        const totalSeeker = await UserModel.countDocuments({ user_role: 'seeker' });
        const totalEmployer = await UserModel.countDocuments({ user_role: 'employer' });

        const totalJob = await JobModel.countDocuments({})
        const totalUsers = await UserModel.countDocuments({})
        const totalApplication = await ApplicationModel.countDocuments({})

        const data = await this.createGraphData()

        if (data) {
            return { data, totalApplication, totalEmployer, totalJob, totalUsers, totalSeeker }
        }
        return false

    }

    getCurrentDateInfo() {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth() + 1;
        return { currentYear, currentMonth };
    }


    async getYearlyData() {
        const { currentYear } = this.getCurrentDateInfo();

       
        const jobData = await JobModel.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, 
                    totalJobs: { $sum: 1 },
                },
            },
            {
                $match: { "_id.year": currentYear }, 
            },
            {
                $sort: { "_id.month": 1 }, 
            },
        ]);

       
        const userData = await UserModel.aggregate([
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, 
                    totalUsers: { $sum: 1 },
                },
            },
            {
                $match: { "_id.year": currentYear }, 
            },
            {
                $sort: { "_id.month": 1 },
            },
        ]);

        const monthlyJobs = Array(12).fill(0);
        const monthlyUsers = Array(12).fill(0);


        jobData.forEach(job => {
            const monthIndex = job._id.month - 1;
            monthlyJobs[monthIndex] = job.totalJobs;
        });


        userData.forEach(user => {
            const monthIndex = user._id.month - 1;
            monthlyUsers[monthIndex] = user.totalUsers;
        });
       
        return {
            jobData: monthlyJobs,
            userData: monthlyUsers,
        };


    }

    async getMonthlyData() {
        const { currentYear, currentMonth } = this.getCurrentDateInfo();
    
        try {
            const jobData = await JobModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $year: "$createdAt" }, currentYear] },
                                { $eq: [{ $month: "$createdAt" }, currentMonth] },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$createdAt" }, // This will give you the day of the month directly
                        totalJobs: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
    
            const userData = await UserModel.aggregate([
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: [{ $year: "$createdAt" }, currentYear] },
                                { $eq: [{ $month: "$createdAt" }, currentMonth] },
                            ],
                        },
                    },
                },
                {
                    $group: {
                        _id: { $dayOfMonth: "$createdAt" },
                        totalUsers: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]);
    
            const dailyJobs = Array(31).fill(0); 
            const dailyUsers = Array(31).fill(0); 
    
            jobData.forEach(job => {
                const dayIndex = job._id - 1; // Fix here
                if (dayIndex >= 0 && dayIndex < dailyJobs.length) { // Check for valid index
                    dailyJobs[dayIndex] = job.totalJobs;
                }
            });
    
            userData.forEach(user => {
                const dayIndex = user._id - 1; // Fix here
                if (dayIndex >= 0 && dayIndex < dailyUsers.length) { // Check for valid index
                    dailyUsers[dayIndex] = user.totalUsers;
                }
            });
    
            
            return {
                jobData: dailyJobs,
                userData: dailyUsers,
            };
    
        } catch (error) {
            console.error('Error fetching monthly data:', error);
            return {
                jobData:Array(31).fill(0),
                userData: Array(31).fill(0),
            };
        }
    }


    async createGraphData() {

        const yearlyData = await this.getYearlyData();
        const monthlyData = await this.getMonthlyData();

        return {
            yearlyData,
            monthlyData,
        };
    }

}

export default GraphRepository;