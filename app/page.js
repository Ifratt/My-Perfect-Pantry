'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button, MenuItem, Select, FormControl, InputLabel, InputAdornment } from '@mui/material';
import { collection, query, getDocs, deleteDoc, getDoc, doc, setDoc } from 'firebase/firestore';
import { Source_Code_Pro, Pixelify_Sans } from '@next/font/google';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import SearchIcon from '@mui/icons-material/Search';

// Fonts
const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  variable: '--font-source-code-pro',
});
const pixelifySans = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixelify-sans',
});

// Image Mapping
const categoryToImageMap = {
  fruit: '/pixel-art/fruits.png',
  vegetable: '/pixel-art/vegetables.png',
  grain: '/pixel-art/grain.png',
  dairy: '/pixel-art/dairy.png',
  protien: '/pixel-art/protien.png',
  snacks: '/pixel-art/snacks.png',
  // Add more mappings as needed
};

export default function Home() {
  // State Variables
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('fruit'); // Default category
  const [searchQuery, setSearchQuery] = useState(''); // Add search query state
  const [searchResult, setSearchResult] = useState(null); // State for search results

  // Function to Update Inventory
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item, category = 'fruit') => {
    // Ensure category is not undefined
    const validCategory = category || item;
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, category } = docSnap.data(); // Retrieve existing category
      await setDoc(docRef, { quantity: quantity + 1, category }); // Preserve the existing category
    } else {
      await setDoc(docRef, { quantity: 1, category: validCategory });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity, category } = docSnap.data(); // Retrieve existing category
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1, category }); // Preserve the existing category
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    // Check if searchQuery is in inventory
    const itemFound = inventory.some(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResult(itemFound);
  }, [searchQuery, inventory]);

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        backgroundImage: 'url(/pixel-art/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        bgcolor: '#e6efde',
      }}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="#b9cce6"
          border="1px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel sx={{ top: '-8px' }}>Category</InputLabel>
              <Select
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                sx={{ paddingBottom: '5px' }}
              >
                <MenuItem value="fruit">Fruit</MenuItem>
                <MenuItem value="vegetable">Vegetable</MenuItem>
                <MenuItem value="grain">Grain</MenuItem>
                <MenuItem value="dairy">Dairy</MenuItem>
                <MenuItem value="protien">Protien</MenuItem>
                <MenuItem value="snacks">Snacks</MenuItem>
                {/* Add more categories as needed */}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName, itemCategory);
                setItemName('');
                setItemCategory('fruit'); // Reset to default category
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        onClick={() => handleOpen()}
        sx={{
          fontFamily: 'var(--font-source-code-pro)',
          backgroundColor: 'white', // Change to desired color
          color: 'black', // Optional: Change text color
          '&:hover': {
            backgroundColor: 'yourHoverColorHere', // Optional: Change hover color
          },
        }}
      >
        Add New Item
      </Button>

      <Box
        border="1px solid #333"
        width="800px"
        height="50px"
        bgcolor={'white'}
        display={'flex'}
        alignItems="center"
        justifyContent="center"
        className={pixelifySans.variable}
      >
        <Typography variant="h5" color={'#0e2a51'} style={{ fontFamily: 'var(--font-pixelify-sans)' }}>
          <Image src="/pixel-art/fruits.png" alt="Fruit" width={30} height={30} style={{ marginRight: '10px' }} />
          ~ Inventory Items ~
          <Image src="/pixel-art/fruits.png" alt="Fruit" width={30} height={30} style={{ marginRight: '10px' }} />
        </Typography>
      </Box>

      <Box
  position={'absolute'}
  top={0}
  left={0}
  border="px solid #333"
  width="100%"
  height="50px"
  bgcolor={'#131337'}
  display={'flex'}
  alignItems="center"
  justifyContent="space-between" // Adjusted for proper alignment
  padding={2}
>
  <Box display="flex" alignItems="center">
    <Image src="/pixel-art/dairy.png" alt="Icon" width={30} height={30} style={{ marginRight: '10px' }} />
    <Typography
      variant="h7"
      color={'#c2d0f5'}
      style={{
        fontFamily: 'var(--font-source-code-pro)',
        marginTop: '-5px'
      }}
    >
      My Perfect Pantry
    </Typography>
  </Box>

  <TextField
    variant="standard" // Changed to 'standard' to have only underline
    fontFamily= 'var(--font-source-code-pro)'
    onChange={(e) => setSearchQuery(e.target.value)}
    placeholder="Search Items" // Added placeholder text
    style={{
      marginBottom: '5px',
      marginLeft: '5px',
      color: 'white',
      flexGrow: 1, // Allows the search bar to grow and take available space
      maxWidth: '300px', // Optional: limit the maximum width
      borderBottom: '.5px solid white', // Ensures the underline is visible
    }}
    InputLabelProps={{
      style: { fontSize: '0.75rem', color: 'white' },
    }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon style={{ color: '#c2d0f5' }} />
        </InputAdornment>
      ),
      style: { height: '30px', color: 'white' },
    }}
  />
</Box>


      <Box
        width="800px"
        height="30px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        gap={1}
        mb={2}
      >
        {searchQuery && (
          searchResult ? (
            <CheckCircleIcon color="success" fontSize="small" />
          ) : (
            <CancelIcon color="error" fontSize="small" />
          )
        )}
        {searchQuery && (
          <Typography variant="h8" color={searchResult ? 'success.main' : 'error.main'}>
            {searchResult ? 'Item Found' : 'No Item Found'}
          </Typography>
        )}
      </Box>

      <Box
        width="800px" 
        height={'400px'}
        bgcolor={"rgba(108, 144, 193, 0.6)"} //background color
        display="grid"
        gridTemplateColumns="repeat(auto-fill, minmax(100px, 1fr))"
        gap={2}
        padding={2}
        overflow={'auto'}
      >
        {filteredInventory.map((item, index) => (
          <Box
            key={index}
            border="1px solid #000"
            padding={2}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            className={sourceCodePro.variable}
            style={{
              fontFamily: 'var(--font-source-code-pro)',
              backgroundColor:"rgba(108, 144, 193, 0.8)", // Change to desired color
            }}
          >
            <Image src={categoryToImageMap[item.category]} alt={item.name} width={50} height={50} />
            <Typography
              variant="h8"
              color={'black'}
              style={{
                fontFamily: 'var(--font-source-code-pro)', fontSize: '12px'
              }}
            >
              {item.name}
            </Typography>
            <Typography
              variant="h12"
              color={'#193369'}
              style={{
                fontFamily: 'var(--font-source-code-pro)', fontSize: '12px'
              }}
            >
              Quantity: {item.quantity}
            </Typography>
            <Box 
              display="flex" 
              alignItems="center" 
              gap={1} // Space between buttons
              
            >
            <Button 
              variant="outlined" 
              onClick={() => addItem(item.name)}
             
              sx={{ 
                fontSize: '13px', // Adjust font size
                padding: '4px 8px', // Adjust padding for button size
                minWidth: '32px', // Set a minimum width for the button
                width: 'auto', // Allows width to adjust based on content and padding
                marginTop: '10px',
                backgroundColor: '#c5cfe8',
                color: 'black'
                
                
              }}
            >
              +
            </Button>
            <Button 
              variant="outlined"  
              onClick={() => removeItem(item.name)}
              sx={{ 
                fontSize: '13px', // Adjust font size
                padding: '4px 6px', // Adjust padding for button size
                minWidth: '32px', // Set a minimum width for the button
                width: 'auto', // Allows width to adjust based on content and padding
                marginTop: '10px',
                backgroundColor: '#c5cfe8',
                color: 'black'
                
              }}
            >
              -
            </Button>
        </Box>

            
          </Box>
        ))}
      </Box>
      <Typography sx={{color: '#c2d0f5', fontSize: '12px'}}>"Icon made by Pixel perfect from www.flaticon.com" </Typography>

    </Box>
  );
}
