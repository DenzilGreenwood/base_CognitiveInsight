// Quick test script for Firebase functions
const testGenerate = async () => {
  try {
    const response = await fetch('https://us-central1-cognitiveinsight-j7xwb.cloudfunctions.net/simGenerate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        datasetGB: 1000,
        auditRatio: 15,
        cacheWarm: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Generate result:', data);
    return data;
  } catch (error) {
    console.error('Generate failed:', error);
    return null;
  }
};

const testVerify = async (generateData) => {
  try {
    const response = await fetch('https://us-central1-cognitiveinsight-j7xwb.cloudfunctions.net/simVerify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        anchorRoot: generateData.anchorRoot,
        proofSample: generateData.proofSample,
        cacheWarm: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Verify result:', data);
    return data;
  } catch (error) {
    console.error('Verify failed:', error);
    return null;
  }
};

// Run tests
testGenerate().then(data => {
  if (data) {
    console.log('✅ Generate test passed');
    testVerify(data).then(result => {
      if (result && result.verified) {
        console.log('✅ Verify test passed');
        console.log('🎉 All tests passed!');
      } else {
        console.log('❌ Verify test failed');
      }
    });
  } else {
    console.log('❌ Generate test failed');
  }
});
