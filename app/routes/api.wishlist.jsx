import prisma from '../db.server';
import { cors } from 'remix-utils/cors';

export async function loader({ request }) {

    let response;
    const method = request.method;
    const url = new URL(request.url);
    const customerId = url?.searchParams?.get('customerId');
    const productId = url?.searchParams?.get('productId');
    const shop = url?.searchParams?.get('shop');

    if (!customerId || !productId || !shop) {
        return Response.json({
            message: "Missing data. Required data: customerId, productId, shop",
            method: method
        });
    }

    const wishlist = await prisma.wishlist.findMany({
        where: {
            customerId: customerId,
            productId: productId,
            shop: shop
        }
    });

    if (wishlist.length > 0) {
        response = Response.json({
            ok: true,
            wishlist: wishlist
        });
    } else {
        response = Response.json({
            ok: false,
            wishlist: false
        });
    }

    return await cors(request, response, {
        origin: "*",
    })
}

export async function action({ request }) {
    let method = request.method;
    let body = await request.json();
    let customerId = body.customerId;
    let customerName = body.customerName;
    let productId = body.productId;
    let productName = body.productName;
    let shop = body.shop;
    let _action = body._action;
    let response;

    if (!customerId || !customerName || !productId || !productName || !shop || !_action) {
        return Response.json({
            message: "Missing data. Required data: customerId, customerName, productId, productName, shop, _action",
            method: _action
        });
    }

    switch (_action) {
        case "CREATE":
            try {
                const wishlist = await prisma.wishlist.create({
                    data: {
                        customerId,
                        customerName,
                        productId,
                        productName,
                        shop
                    }
                });
                response = Response.json({
                    message: "Product added to wishlist",
                    method: method,
                    wishlist: wishlist
                });
            } catch (error) {
                response = Response.error({
                    message: "Failed to add product to wishlist",
                    error: _action
                });
            }
            return await cors(request, response, {
                origin: true
            });
        
        case "DELETE":
            try {
                await prisma.wishlist.deleteMany({
                    where: {
                        customerId,
                        customerName,
                        productId,
                        productName,
                        shop
                    }
                });
                const wishlistCount = await prisma.wishlist.count({
                    where: {
                        customerId,
                        shop
                    }
                });
                response = Response.json({
                    message: "Product removed from wishlist",
                    method: _action,
                    wishlist: false,
                    removed: true,
                    wishlistCount: wishlistCount
                });
            } catch (error) {
                response = Response.error({
                    message: "Failed to remove product from wishlist",
                    error: error
                });
            }
            return await cors(request, response, {
                origin: true
            });

        default:
            return Response.json({
                ok: false,
                message: "Method not allowed"
            });
    }
}