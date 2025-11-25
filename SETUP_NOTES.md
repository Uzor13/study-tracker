# Setup Notes

## File Upload Configuration (Vercel Blob)

### For Development:
1. Get Vercel Blob token from: https://vercel.com/dashboard
2. Go to Storage → Blob → Create Store
3. Copy the `BLOB_READ_WRITE_TOKEN`
4. Add to `.env.local`:
```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_XXXXXXXXXXXX
```

### For Production (Vercel Deployment):
The `BLOB_READ_WRITE_TOKEN` is automatically provided by Vercel when you deploy.
No manual configuration needed!

### For Local Development Without Vercel Blob:
You can use a mock implementation or skip file upload features temporarily.
The app will work without it, but document uploads won't function.

---

## Currency Exchange API (Coming Soon)

We'll be integrating a currency conversion API to convert between:
- NGN (Nigerian Naira)
- USD (US Dollar)
- CAD (Canadian Dollar)

Recommended API: https://exchangerate-api.com (Free tier: 1,500 requests/month)

---

## Features Implemented

✅ Authentication with email verification
✅ Degree type selection (Undergrad, Masters, PhD)
✅ 30 Canadian schools seeded (universities, colleges, polytechnics)
✅ School browser with filters and search
✅ Document upload system with Vercel Blob
✅ Multi-currency support in database

---

## Next Steps

1. Currency conversion API integration
2. Degree-specific document requirements
3. Smart timeline automation
4. AI document checker
5. Chatbot assistant
