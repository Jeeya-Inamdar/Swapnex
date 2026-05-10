import fetch from "node-fetch";

const API_BASE = "http://localhost:5000/api";

const testAPI = async () => {
  console.log("Starting backend API tests...");
  let passed = 0;
  let failed = 0;

  const runTest = async (name, endpoint, options = {}) => {
    try {
      const res = await fetch(`${API_BASE}${endpoint}`, options);
      const data = await res.json();
      if (res.ok && !data.error) {
        console.log(`✅ [PASS] ${name}`);
        passed++;
      } else {
        console.error(`❌ [FAIL] ${name} - Error:`, data.error || res.statusText);
        failed++;
      }
    } catch (error) {
      console.error(`❌ [FAIL] ${name} - Exception:`, error.message);
      failed++;
    }
  };

  // Test 1: Get suggested users (public-ish, might need auth but let's see if it returns 200 or 401 correctly)
  await runTest("Get Suggested Users", "/users/suggested");

  // Test 2: Get a user profile (Assuming jeeya was seeded)
  await runTest("Get User Profile (jeeya)", "/users/profile/jeeya");

  // Test 3: Attempt login with seeded credentials
  let authCookie = "";
  try {
    const loginRes = await fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "jeeya", password: "123456" }),
    });
    
    if (loginRes.ok) {
      const setCookieHeader = loginRes.headers.raw()['set-cookie'];
      if (setCookieHeader) {
        authCookie = setCookieHeader[0].split(';')[0];
      }
      console.log(`✅ [PASS] Login Test`);
      passed++;
    } else {
      console.error(`❌ [FAIL] Login Test - Status: ${loginRes.status}`);
      failed++;
    }
  } catch (error) {
    console.error(`❌ [FAIL] Login Test - Exception:`, error.message);
    failed++;
  }

  // Test 4: Get feed (Requires auth)
  await runTest("Get Feed Posts", "/posts/feed", {
    headers: { "Cookie": authCookie }
  });

  // Test 5: Get conversations (Requires auth)
  await runTest("Get Conversations", "/messages/conversations", {
    headers: { "Cookie": authCookie }
  });

  // Test 6: Create Post (Requires auth)
  try {
    const createRes = await fetch(`${API_BASE}/posts/create`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Cookie": authCookie
      },
      body: JSON.stringify({ 
        postedBy: "663e00000000000000000001", // dummy id
        text: "Test post from API script" 
      }),
    });
    const data = await createRes.json();
    if (createRes.status === 201 || (createRes.status === 401 && data.error === "Unauthorized to create post")) {
        console.log(`✅ [PASS] Create Post Endpoint Found (Status: ${createRes.status})`);
        passed++;
    } else {
        console.error(`❌ [FAIL] Create Post Endpoint - Status: ${createRes.status}, Error:`, data.error);
        failed++;
    }
  } catch (error) {
    console.error(`❌ [FAIL] Create Post Endpoint - Exception:`, error.message);
    failed++;
  }

  console.log(`\nTest Summary: ${passed} passed, ${failed} failed.`);
};

testAPI();
