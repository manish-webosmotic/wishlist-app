import prisma from '../db.server';
import { cors } from 'remix-utils/cors';

export async function loader({ request }) {
    let response;
    const method = request.method;
    const url = new URL(request.url);
    const customerId = url?.searchParams?.get('customerId');
    const shop = url?.searchParams?.get('shop');

    if (!customerId || !shop) {
        return Response.json({
            message: "Missing data. Required data: customerId, shop",
            method: method
        });
    }

    const wishlist = await prisma.wishlist.findMany({
        where: {
            customerId: customerId,
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