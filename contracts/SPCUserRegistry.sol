// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SPCUserRegistry
 * @dev Manages user registration and verification on the SPC Alliance platform
 */

contract SPCUserRegistry {
    
    struct User {
        address walletAddress;
        string username;
        uint256 registeredAt;
        uint256 pointsUploaded;
        uint256 totalEarnings;
        bool isVerified;
    }
    
    mapping(address => User) public users;
    mapping(string => address) public usernameToAddress;
    
    address public owner;
    uint256 public totalUsers;
    
    event UserRegistered(address indexed userAddress, string username, uint256 timestamp);
    event UserVerified(address indexed userAddress, uint256 timestamp);
    event UserUpdated(address indexed userAddress, uint256 pointsUploaded, uint256 earnings);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        totalUsers = 0;
    }
    
    /**
     * @dev Register a new user with wallet address
     * @param _username Desired username for the platform
     */
    function registerUser(string memory _username) external {
        require(bytes(_username).length > 0, "Username cannot be empty");
        require(users[msg.sender].walletAddress == address(0), "User already registered");
        require(usernameToAddress[_username] == address(0), "Username already taken");
        
        users[msg.sender] = User({
            walletAddress: msg.sender,
            username: _username,
            registeredAt: block.timestamp,
            pointsUploaded: 0,
            totalEarnings: 0,
            isVerified: false
        });
        
        usernameToAddress[_username] = msg.sender;
        totalUsers++;
        
        emit UserRegistered(msg.sender, _username, block.timestamp);
    }
    
    /**
     * @dev Get user details
     */
    function getUser(address _userAddress) external view returns (User memory) {
        require(users[_userAddress].walletAddress != address(0), "User not found");
        return users[_userAddress];
    }
    
    /**
     * @dev Verify a user (can be called by owner or verification system)
     */
    function verifyUser(address _userAddress) external onlyOwner {
        require(users[_userAddress].walletAddress != address(0), "User not found");
        users[_userAddress].isVerified = true;
        emit UserVerified(_userAddress, block.timestamp);
    }
    
    /**
     * @dev Update user earnings and points (called by marketplace)
     */
    function updateUserStats(address _userAddress, uint256 _pointsAdded, uint256 _earningsAdded) external onlyOwner {
        require(users[_userAddress].walletAddress != address(0), "User not found");
        users[_userAddress].pointsUploaded += _pointsAdded;
        users[_userAddress].totalEarnings += _earningsAdded;
        emit UserUpdated(_userAddress, users[_userAddress].pointsUploaded, users[_userAddress].totalEarnings);
    }
    
    /**
     * @dev Check if user is registered
     */
    function isUserRegistered(address _userAddress) external view returns (bool) {
        return users[_userAddress].walletAddress != address(0);
    }
    
    /**
     * @dev Check if user is verified
     */
    function isUserVerified(address _userAddress) external view returns (bool) {
        return users[_userAddress].isVerified;
    }
}
