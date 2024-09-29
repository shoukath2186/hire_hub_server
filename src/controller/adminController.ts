import { NextFunction, Request, Response } from "express";
import AdminUseCase from "../usecase/adminUseCase";


interface IResponse {
   status: number,
   message?: string,
   data?: any
}


class AdminController {

   private useCase: AdminUseCase

   constructor(adminUseCase: AdminUseCase) {
      this.useCase = adminUseCase
   }

   async login(req: Request, res: Response, next: NextFunction) {
      try {


         const response: any = await this.useCase.matchingAdmin(req.body.email, req.body.password);


         if (response.status == 400) {
            return res.status(response.status).json(response.message)
         }


         const createToken = await this.useCase.createToken(response._id, response.email);

         const { refreshToken, accessToken } = createToken;

         res.cookie('AdminRefreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 10 * 24 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'strict',
         });

         res.cookie('AdminAccessToken', accessToken, {
            httpOnly: true,
            maxAge: 1 * 60 * 60 * 1000,
            secure: true,
            sameSite: 'strict',
         });


         return res.status(200).json({ email: response.email, name: response.name });




      } catch (error) {
         next(error)
      }
   }

   async findAllUsers(req: Request, res: Response, next: NextFunction) {
      try {
         const allData = await this.useCase.takeAllUser()
         // console.log(111,allData);


         if (allData) {
            return res.status(200).json({ data: allData })
         } else {
            return res.status(400).json('faild.')
         }
      } catch (error) {
         next(error)
      }
   }

   async blockUser(req: Request, res: Response, next: NextFunction) {

      try {
         const { id } = req.query;

         const allData = await this.useCase.blockUser(id);

         if (allData) {
            return res.status(200).json({ data: allData })
         } else {
            return res.status(400).json('faild.')
         }

      } catch (error) {
         next(error);
      }
   }

   async addCategory(req: Request, res: Response, next: NextFunction) {
      try {
         const name = req.body.name;

         const allCategory: IResponse = await this.useCase.addCategory(name);

         if (allCategory?.status == 200) {

            res.status(200).json(allCategory.data)

         } else {

            res.status(allCategory.status).json(allCategory.message)

         }

      } catch (error) {
         next(error)
      }
   }

   async allCategorydata(req: Request, res: Response, next: NextFunction) {
      try {

         const allCategory: IResponse = await this.useCase.allCategory();

         if (allCategory?.status == 200) {
            res.status(200).json(allCategory.data)

         } else {

            res.status(allCategory.status).json(allCategory.message)

         }
      } catch (error) {
         next(error)
      }

   }


   async blockCategory(req: Request, res: Response, next: NextFunction) {
      try {
         const { id } = req.query;

         const categoryData: IResponse = await this.useCase.blockCategory(id);

         if (categoryData?.status == 200) {
            res.status(200).json(categoryData.data)

         } else {

            res.status(categoryData.status).json(categoryData.message)

         }

      } catch (error) {
         next(error)
      }
   }





   async logout(req: Request, res: Response, next: NextFunction) {
      try {
         const admin = req.body.data
         const data = req.query.id
         // console.log(234,data);


         if (admin == 'admin') {
            res.clearCookie('AdminRefreshToken');
            res.clearCookie('AdminAccessToken');
            return res.status(200).json('success')

         }
         return res.status(400).json('faild.')
      } catch (error) {
         next(error)
      }
   }
   async editCategory(req: Request, res: Response, next: NextFunction) {
      try {
         const response = await this.useCase.editCatagory(req);
         res.status(response.status).json(response.message)
      } catch (error) {
         next(error)
      }
   }
   async degeteCategory(req: Request, res: Response, next: NextFunction) {
      try {
         const response = await this.useCase.deleteCategory(req.query.id);
         res.status(response.status).json(response.message)
      } catch (error) {
         next(error)
      }
   }
   async takeAlljobs(req: Request, res: Response, next: NextFunction) {
      try {
         const data = await this.useCase.takeAllJob();
         if (data.status == 200) {
            res.status(200).json(data.data)
         } else {
            res.status(data.status).json(data.message);
         }
      } catch (error) {
         next(error)
      }
   }

   async blockJob(req: Request, res: Response, next: NextFunction) {

      try {
         const response = await this.useCase.blockJob(req.body.id);
         res.status(response.status).json(response.message);
      } catch (error) {
         next(error)
      }
   }

}

export default AdminController