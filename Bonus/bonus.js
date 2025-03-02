function canJump(nums) {
    let maxReach = 0; // Initialize the farthest index we can reach
    for (let i = 0; i < nums.length; i++) {
        // If the current index is beyond the farthest  return false
        if (i > maxReach) {
            return false;
        }
        // Update the farthest index we can reach
        maxReach = Math.max(maxReach, i + nums[i]);
        // If we can reach or surpass the last index, return true
        if (maxReach >= nums.length - 1) {
            return true;
        }
    }
    // If we finish the loop, return true
    return true;
}