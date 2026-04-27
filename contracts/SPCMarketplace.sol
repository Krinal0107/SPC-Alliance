// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title SPCMarketplace
 * @dev Manages buying and selling of survey points with revenue sharing
 */

interface ISPCUserRegistry {
    function updateUserStats(address _userAddress, uint256 _pointsAdded, uint256 _earningsAdded) external;
    function isUserVerified(address _userAddress) external view returns (bool);
}

contract SPCMarketplace {
    
    struct SurveyPoint {
        uint256 pointId;
        address uploader;
        string dataHash; // IPFS hash of the survey data
        uint256 price; // in USDC or native token
        uint256 uploadedAt;
        uint256 purchaseCount;
        bool isActive;
    }
    
    struct Purchase {
        uint256 purchaseId;
        uint256 pointId;
        address buyer;
        address seller;
        uint256 amount;
        uint256 purchasedAt;
    }
    
    ISPCUserRegistry public userRegistry;
    
    mapping(uint256 => SurveyPoint) public surveyPoints;
    mapping(uint256 => Purchase) public purchases;
    
    uint256 public nextPointId;
    uint256 public nextPurchaseId;
    
    address public owner;
    uint256 public platformFeePercent; // 10 = 10%
    
    event PointUploaded(uint256 indexed pointId, address indexed uploader, uint256 price);
    event PointPurchased(uint256 indexed purchaseId, uint256 indexed pointId, address indexed buyer, uint256 amount);
    event PriceUpdated(uint256 indexed pointId, uint256 newPrice);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier onlyVerified() {
        require(userRegistry.isUserVerified(msg.sender), "User must be verified");
        _;
    }
    
    constructor(address _userRegistry) {
        owner = msg.sender;
        userRegistry = ISPCUserRegistry(_userRegistry);
        nextPointId = 1;
        nextPurchaseId = 1;
        platformFeePercent = 10; // 10% platform fee
    }
    
    /**
     * @dev Upload a new survey point
     */
    function uploadPoint(string memory _dataHash, uint256 _price) external onlyVerified {
        require(bytes(_dataHash).length > 0, "Data hash cannot be empty");
        require(_price > 0, "Price must be greater than 0");
        
        surveyPoints[nextPointId] = SurveyPoint({
            pointId: nextPointId,
            uploader: msg.sender,
            dataHash: _dataHash,
            price: _price,
            uploadedAt: block.timestamp,
            purchaseCount: 0,
            isActive: true
        });
        
        emit PointUploaded(nextPointId, msg.sender, _price);
        nextPointId++;
    }
    
    /**
     * @dev Purchase a survey point
     */
    function purchasePoint(uint256 _pointId) external payable {
        require(surveyPoints[_pointId].isActive, "Point not found or inactive");
        require(msg.value >= surveyPoints[_pointId].price, "Insufficient payment");
        
        SurveyPoint storage point = surveyPoints[_pointId];
        
        uint256 platformFee = (msg.value * platformFeePercent) / 100;
        uint256 sellerAmount = msg.value - platformFee;
        
        // Transfer to seller
        (bool sellerSuccess, ) = point.uploader.call{value: sellerAmount}("");
        require(sellerSuccess, "Transfer to seller failed");
        
        // Store platform fee (owner can withdraw)
        point.purchaseCount++;
        
        purchases[nextPurchaseId] = Purchase({
            purchaseId: nextPurchaseId,
            pointId: _pointId,
            buyer: msg.sender,
            seller: point.uploader,
            amount: msg.value,
            purchasedAt: block.timestamp
        });
        
        emit PointPurchased(nextPurchaseId, _pointId, msg.sender, msg.value);
        nextPurchaseId++;
    }
    
    /**
     * @dev Get point details
     */
    function getPoint(uint256 _pointId) external view returns (SurveyPoint memory) {
        require(surveyPoints[_pointId].isActive, "Point not found");
        return surveyPoints[_pointId];
    }
    
    /**
     * @dev Update point price
     */
    function updatePointPrice(uint256 _pointId, uint256 _newPrice) external {
        require(surveyPoints[_pointId].uploader == msg.sender, "Only uploader can update price");
        require(_newPrice > 0, "Price must be greater than 0");
        
        surveyPoints[_pointId].price = _newPrice;
        emit PriceUpdated(_pointId, _newPrice);
    }
    
    /**
     * @dev Deactivate a point
     */
    function deactivatePoint(uint256 _pointId) external {
        require(surveyPoints[_pointId].uploader == msg.sender, "Only uploader can deactivate");
        surveyPoints[_pointId].isActive = false;
    }
    
    /**
     * @dev Set platform fee percentage
     */
    function setPlatformFee(uint256 _feePercent) external onlyOwner {
        require(_feePercent <= 50, "Fee cannot exceed 50%");
        platformFeePercent = _feePercent;
    }
    
    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }
    
    receive() external payable {}
}
