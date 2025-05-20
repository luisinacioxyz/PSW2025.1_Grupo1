import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { addCoupon } from "./couponSlice";

const initialState = {
  ratings: [],
  status: "idle",
  error: null,
};

// Helper function to generate a platform-specific coupon code
const generateCouponCode = (platform) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = platform.substring(0, 3).toUpperCase() + "-";
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Agora fetchRatings recebe courseId para filtrar avaliações por curso
export const fetchRatings = createAsyncThunk(
  "ratings/fetchRatings",
  async (courseId) => {
    const url = courseId
      ? `http://localhost:3001/ratings?courseId=${courseId}`
      : "http://localhost:3001/ratings";
    const response = await fetch(url);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Falha ao buscar avaliações");
    }
    return response.json();
  }
);

// Get processed rating IDs from the server
const getProcessedRatingIds = async (userId, platform) => {
  try {
    const response = await fetch(
      `http://localhost:3001/processedRatings?userId=${userId}&platform=${platform}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch processed ratings");
    }

    const data = await response.json();
    return data.length > 0 ? data[0].ratingIds : [];
  } catch (error) {
    console.error("Error fetching processed ratings:", error);
    return [];
  }
};

// Save processed rating IDs to the server
const saveProcessedRatingIds = async (userId, platform, ratingIds) => {
  try {
    // Check if an entry already exists
    const response = await fetch(
      `http://localhost:3001/processedRatings?userId=${userId}&platform=${platform}`
    );
    const data = await response.json();

    if (data.length > 0) {
      // Update existing entry
      const existingEntry = data[0];
      const updateResponse = await fetch(
        `http://localhost:3001/processedRatings/${existingEntry.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...existingEntry,
            ratingIds,
            updatedAt: new Date().toISOString(),
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update processed ratings");
      }
    } else {
      // Create new entry
      const createResponse = await fetch(
        "http://localhost:3001/processedRatings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            platform,
            ratingIds,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }),
        }
      );

      if (!createResponse.ok) {
        throw new Error("Failed to create processed ratings entry");
      }
    }
  } catch (error) {
    console.error("Error saving processed ratings:", error);
  }
};

export const addRating = createAsyncThunk(
  "ratings/addRating",
  async ({ courseId, userId, rating, review }, { dispatch, getState }) => {
    // Create the rating
    const payload = {
      courseId,
      userId,
      rating,
      review,
      createdAt: new Date().toISOString(),
    };

    const ratingResponse = await fetch("http://localhost:3001/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!ratingResponse.ok) throw new Error("Erro ao adicionar avaliação");
    const newRating = await ratingResponse.json();

    // Check for coupon eligibility
    const state = getState();
    const course = state.courses.courses.find((c) => c.id === courseId);

    if (course) {
      const platform = course.platform;

      // Get all ratings for this user and platform without affecting the current view
      const allRatings = await fetch("http://localhost:3001/ratings").then(
        (res) => res.json()
      );

      // Filter ratings by this user for courses from the same platform
      const platformRatings = allRatings.filter((r) => {
        const ratedCourse = state.courses.courses.find(
          (c) => c.id === r.courseId
        );
        return (
          r.userId === userId &&
          ratedCourse &&
          ratedCourse.platform === platform
        );
      });

      // Get processed rating IDs
      const processedRatingIds = await getProcessedRatingIds(userId, platform);

      // Find new (unprocessed) ratings for this platform
      const newPlatformRatings = platformRatings.filter(
        (r) => !processedRatingIds.includes(r.id)
      );

      console.log(
        `User ${userId} has ${newPlatformRatings.length} new ratings for ${platform} platform`
      );

      // If user has 3 or more new ratings, generate a coupon
      if (newPlatformRatings.length >= 3) {
        // Check if user already has a coupon for this platform
        const couponsResponse = await fetch(
          `http://localhost:3001/coupons?userId=${userId}&platform=${platform}`
        );
        const existingCoupons = await couponsResponse.json();

        // Generate coupon if none exists or if the existing ones are expired
        const now = new Date();
        const activeCoupons = existingCoupons.filter(
          (c) => new Date(c.expiresAt) > now
        );

        if (activeCoupons.length === 0) {
          const couponData = {
            userId,
            courseId,
            code: generateCouponCode(platform),
            discount: 15,
            platform: platform,
            expiresAt: new Date(
              Date.now() + 30 * 24 * 60 * 60 * 1000
            ).toISOString(), // 30 days from now
          };

          try {
            console.log(`Creating ${platform} coupon for user ${userId}`);
            await dispatch(addCoupon(couponData)).unwrap();

            // Mark these ratings as processed for coupon generation
            const updatedProcessedIds = [
              ...processedRatingIds,
              ...newPlatformRatings.map((r) => r.id),
            ];
            await saveProcessedRatingIds(userId, platform, updatedProcessedIds);
          } catch (error) {
            console.error("Failed to create coupon:", error);
          }
        }
      }
    }

    // Fetch only the ratings for this course to update the UI
    dispatch(fetchRatings(courseId));

    return newRating;
  }
);

export const updateRating = createAsyncThunk(
  "ratings/updateRating",
  async ({ id, courseId, userId, rating, review, createdAt }) => {
    const payload = { id, courseId, userId, rating, review, createdAt };
    const res = await fetch(`http://localhost:3001/ratings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao atualizar avaliação");
    return await res.json();
  }
);

export const deleteRating = createAsyncThunk(
  "ratings/deleteRating",
  async (id) => {
    const res = await fetch(`http://localhost:3001/ratings/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao deletar avaliação");
    return id;
  }
);

const ratingSlice = createSlice({
  name: "ratings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRatings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRatings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.ratings = action.payload;
        state.error = null;
      })
      .addCase(fetchRatings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Falha ao buscar avaliações";
      })
      .addCase(addRating.fulfilled, (state, action) => {
        // We'll let fetchRatings update the state more accurately
        // No need to update state.ratings here
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        const idx = state.ratings.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.ratings[idx] = action.payload;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.ratings = state.ratings.filter((r) => r.id !== action.payload);
      });
  },
});

export default ratingSlice.reducer;
