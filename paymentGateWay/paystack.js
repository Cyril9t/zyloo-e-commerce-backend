// import https from "https";
// import prisma from "../config/prisma.js";

// export const initializePayment = async (req, res) => {
//     try {
//         const user = req.user;

//         const {
//             item,
//             email,
//             firstName,
//             lastName,
//             StreetAddress,
//             city,
//             state,
//             postalCode,
//             paymentMethod
//         } = req.body;

//         // Validate required fields
//         if (
//             !item ||
//             !Array.isArray(item) ||
//             item.length === 0 ||
//             !email ||
//             !firstName ||
//             !lastName ||
//             !StreetAddress ||
//             !city ||
//             !state ||
//             !postalCode ||
//             !paymentMethod
//         ) {
//             return res.status(400).json({
//                 Message: "All fields are required"
//             });
//         }

//         /*
//          * Calculate the total on the SERVER.
//          * Do not trust the total sent from the frontend.
//          */
//         let total = 0;

//         for (const i of item) {
//             const productItem = await prisma.productItem.findUnique({
//                 where: {
//                     id: i.productItem.id
//                 },
//                 include: {
//                     product: true
//                 }
//             });

//             if (!productItem) {
//                 return res.status(404).json({
//                     Message: "Product item not found"
//                 });
//             }

//             if (productItem.stock < i.quantity) {
//                 return res.status(400).json({
//                     Message: `${productItem.product.name} does not have enough stock`
//                 });
//             }

//             total += productItem.price * i.quantity;
//         }

//         /*
//          * Paystack expects the amount in kobo.
//          */
//         const amount = total * 100;

//         const params = JSON.stringify({
//             email,
//             amount,

//             // Change this to your real frontend URL in production
//             callback_url: "http://localhost:5173/payment/callback"
//         });

//         const options = {
//             hostname: "api.paystack.co",
//             port: 443,
//             path: "/transaction/initialize",
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_TEST_KEY}`,
//                 "Content-Type": "application/json"
//             }
//         };

//         const paystackReq = https.request(options, (paystackRes) => {
//             let data = "";

//             paystackRes.on("data", (chunk) => {
//                 data += chunk;
//             });

//             paystackRes.on("end", () => {
//                 try {
//                     const response = JSON.parse(data);

//                     if (!response.status) {
//                         return res.status(400).json({
//                             Message: response.message || "Payment initialization failed"
//                         });
//                     }

//                     return res.status(200).json({
//                         Message: "Payment initialized",
//                         authorization_url:
//                             response.data.authorization_url,
//                         access_code:
//                             response.data.access_code,
//                         reference:
//                             response.data.reference
//                     });
//                 } catch (error) {
//                     console.error(error);

//                     return res.status(500).json({
//                         Message: "Invalid response from Paystack"
//                     });
//                 }
//             });
//         });

//         paystackReq.on("error", (error) => {
//             console.error("Paystack error:", error);

//             return res.status(500).json({
//                 Message: "Unable to initialize payment"
//             });
//         });

//         paystackReq.write(params);
//         paystackReq.end();

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             Message: "Internal server error"
//         });
//     }
// };






// export const initializePayment = async (req, res) => {
//     try {
//         const user = req.user;

//         const {
//             item,
//             email,
//             firstName,
//             lastName,
//             StreetAddress,
//             city,
//             state,
//             postalCode,
//             paymentMethod
//         } = req.body;

//         // Validate required fields
//         if (
//             !item ||
//             !Array.isArray(item) ||
//             item.length === 0 ||
//             !email ||
//             !firstName ||
//             !lastName ||
//             !StreetAddress ||
//             !city ||
//             !state ||
//             !postalCode ||
//             !paymentMethod
//         ) {
//             return res.status(400).json({
//                 Message: "All fields are required"
//             });
//         }

//         /*
//          * Calculate the total on the SERVER.
//          * Do not trust the total sent from the frontend.
//          */
//         let total = 0;

//         for (const i of item) {
//             const productItem = await prisma.productItem.findUnique({
//                 where: {
//                     id: i.productItem.id
//                 },
//                 include: {
//                     product: true
//                 }
//             });

//             if (!productItem) {
//                 return res.status(404).json({
//                     Message: "Product item not found"
//                 });
//             }

//             if (productItem.stock < i.quantity) {
//                 return res.status(400).json({
//                     Message: `${productItem.product.name} does not have enough stock`
//                 });
//             }

//             total += productItem.price * i.quantity;
//         }

//         /*
//          * Paystack expects the amount in kobo.
//          */
//         const amount = total * 100;

//         const params = JSON.stringify({
//             email,
//             amount,

//             // Change this to your real frontend URL in production
//             callback_url: "http://localhost:5173/"
//         });

//         const options = {
//             hostname: "api.paystack.co",
//             port: 443,
//             path: "/transaction/initialize",
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_TEST_KEY}`,
//                 "Content-Type": "application/json"
//             }
//         };

//         const paystackReq = https.request(options, (paystackRes) => {
//             let data = "";

//             paystackRes.on("data", (chunk) => {
//                 data += chunk;
//             });

//             paystackRes.on("end", () => {
//                 try {
//                     const response = JSON.parse(data);

//                     if (!response.status) {
//                         return res.status(400).json({
//                             Message: response.message || "Payment initialization failed"
//                         });
//                     }

//                     return res.status(200).json({
//                         Message: "Payment initialized",
//                         authorization_url:
//                             response.data.authorization_url,
//                         access_code:
//                             response.data.access_code,
//                         reference:
//                             response.data.reference
//                     });
//                 } catch (error) {
//                     console.error(error);

//                     return res.status(500).json({
//                         Message: "Invalid response from Paystack"
//                     });
//                 }
//             });
//         });

//         paystackReq.on("error", (error) => {
//             console.error("Paystack error:", error);

//             return res.status(500).json({
//                 Message: "Unable to initialize payment"
//             });
//         });

//         paystackReq.write(params);
//         paystackReq.end();

//     } catch (error) {
//         console.error(error);

//         return res.status(500).json({
//             Message: "Internal server error"
//         });
//     }
// };