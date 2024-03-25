import {Admin} from "@/models/Admin";
import {mongooseConnect} from "@/lib/mongoose";
import {isAdminRequest} from "@/pages/api/auth/[...nextauth]";

export default async function handle(req,res) {
    await mongooseConnect();
    await isAdminRequest(req,res);

    if (req.method === 'POST') {
        const {email} = req.body;
        if (await Admin.findOne({email})) {
            res.status(400).json({message:'Admin email already exists!'});
        } else {
            res.json(await Admin.create({email}));
        }
    }

    if (req.method === 'GET') {
        res.json(await Admin.find());
    }

    if (req.method === 'DELETE') {
        const {_id} = req.query;
        await Admin.findByIdAndDelete(_id);
        res.json(true);
    }

    if (req.method === "PUT") {
        const { email } = req.body;
        const { _id } = req.query;

        // Check if the email already exists for another admin
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin && existingAdmin._id.toString() !== _id.toString()) {
            res.status(400).json({ message: "Admin email already exists!" });
        } else {
            // Find the admin by its ID and update the email field
            await Admin.findByIdAndUpdate(_id, { email });

            // Fetch the updated admin after the update operation
            const updatedAdmin = await Admin.findById(_id);

            res.json(updatedAdmin);
        }

    }
}