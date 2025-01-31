import React, { useState, useEffect } from "react";
import {
    Button,
    Menu,
    MenuItem,
    Modal,
    Box,
    Typography,
    List,
    ListItem,
    Checkbox,
    ListItemButton,
    ListItemAvatar,
    Avatar,
    ListItemText,
    TextField
} from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useUserStore } from "../store/useUserStore";
import { useNavigate, useParams } from 'react-router-dom';
const MoreOption = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [name, setName] = useState('')
    const [isModalOpen, setModalOpen] = useState(false);
    const [isGroupModalOpen, setGroupModalOpen] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isChatModalOpen, setChatModalOpen] = useState(false);
    const { logout } = useAuthStore();
    const { createDialog, dialogs, getDialogs, deleteDialog } = useChatStore();
    const { users, getUsers } = useUserStore();
    const [checked, setChecked] = useState([]);
    const navigate = useNavigate();
    const { dialogId } = useParams();

    useEffect(() => {
        getUsers();
        getDialogs()
    }, [getUsers, getDialogs]);

    const isMenuOpen = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleModalOpen = () => {
        setModalOpen(true);
        handleMenuClose();
    };

    const handleGroupModalOpen = () => {
        setGroupModalOpen(true);
        handleMenuClose();
    };

    const handleDeleteModalOpen = () => {
        setDeleteModalOpen(true);
        handleMenuClose();
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setGroupModalOpen(false);
        setChecked([]);
    };

    const handleDeleteModalClose = () => {
        setDeleteModalOpen(false);
        setChecked([]);
    };

    const handleNameOpen = () => {
        if (checked.length > 1) {
            setChatModalOpen(true);
        }
        handleMenuClose();
        handleModalClose();
    };

    const handleNameClose = () => {
        setChatModalOpen(false);

    };

    const handleChatCreate = () => {
        console.log(dialogs)
        console.log(checked)
        const filter = dialogs?.filter((dialog) => dialog.user_id === checked)
        console.log(filter)
        createDialog({ checked, type: 3 })
        setChecked([]);
        handleMenuClose();
        handleModalClose();
    };
    const handleGrpCreate = () => {
        const groupExists = dialogs.some(dialog => dialog.name.toLowerCase() === name.toLowerCase());

        if (!name.trim()) {
            alert("Please enter a group name");
            return
        }

        if (groupExists) {
            alert("Group name already exists. Please choose a unique name.");
            return
        }

        createDialog({ name: name, checked: checked, type: 2 });
        handleNameClose();
        setChecked([]);
    };


    const handleDeleteChat = () => {
        deleteDialog(checked)
        if (checked.includes(dialogId)) {
            navigate("/");
        }
        handleMenuClose();
        handleDeleteModalClose();
        setChecked([]);
    };

    const handleToggle = (value) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    return (
        <>
            <Button
                id="basic-button"
                sx={{ p: 0, minWidth: 0 }}
                aria-controls={isMenuOpen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={isMenuOpen ? "true" : undefined}
                onClick={handleMenuClick}
            >
                <MoreVertIcon sx={{ color: "var(--medium-gray)" }} />
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={isMenuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                <MenuItem onClick={handleModalOpen}>Create New Chat</MenuItem>
                <MenuItem onClick={handleGroupModalOpen}>Create New Group</MenuItem>
                <MenuItem onClick={handleDeleteModalOpen}>Delete Chat</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>

            {/* create chat Modal */}
            <Modal
                open={isModalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="modal-style">
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            sx={{ textAlign: "center" }}
                            id="modal-title"
                            variant="h6"
                        >
                            Create New Chat
                        </Typography>
                        <button disabled={checked.length === 0} onClick={handleChatCreate}>Create</button>
                    </Box>
                    <Box id="modal-description" sx={{ mt: 2 }}>
                        <List dense sx={{ width: "100%", maxWidth: 360 }}>
                            {users?.map((value, index) => {
                                const labelId = `checkbox-list-secondary-label-${value.id}`;
                                return (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Checkbox
                                                edge="end"
                                                disabled={checked.length === 1 && !checked.includes(value.user.id)}
                                                sx={{ color: "var(--light-gray)" }}
                                                onChange={handleToggle(value.user.id)}
                                                checked={checked.includes(value.user.id)}
                                                inputProps={{ "aria-labelledby": labelId }}
                                            />
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={value.user.name}
                                                    src={value.user.blob_id}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={value.user.login} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Box>
            </Modal>
            {/* create Group chat Modal */}
            <Modal
                open={isGroupModalOpen}
                onClose={handleModalClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box className="modal-style">
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            sx={{ textAlign: "center" }}
                            id="modal-title"
                            variant="h6"
                        >
                            Create New Chat
                        </Typography>
                        <button onClick={handleNameOpen}>Create</button>
                    </Box>
                    <Box id="modal-description" sx={{ mt: 2 }}>
                        <List dense sx={{ width: "100%", maxWidth: 360 }}>
                            {users?.map((value, index) => {
                                const labelId = `checkbox-list-secondary-label-${value.id}`;
                                return (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Checkbox
                                                edge="end"
                                                sx={{ color: "var(--light-gray)" }}
                                                onChange={handleToggle(value.user.id)}
                                                checked={checked.includes(value.user.id)}
                                                inputProps={{ "aria-labelledby": labelId }}
                                            />
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={value.user.name}
                                                    src={value.user.blob_id}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={value.user.login} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Box>
            </Modal>
            {/* delete chat Modal */}
            <Modal open={isDeleteModalOpen} onClose={handleDeleteModalClose}>
                <Box className="modal-style">
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography
                            sx={{ textAlign: "center" }}
                            id="modal-title"
                            variant="h6"
                        // component="h2"
                        >
                            Delete Chats
                        </Typography>
                        <button onClick={handleDeleteChat}>Delete</button>
                    </Box>
                    <Box id="modal-description" sx={{ mt: 2 }}>
                        <List dense sx={{ width: "100%", maxWidth: 360 }}>
                            {dialogs?.map((value, index) => {
                                const labelId = `checkbox-list-secondary-label-${value.id}`;
                                return (
                                    <ListItem
                                        key={index}
                                        secondaryAction={
                                            <Checkbox
                                                edge="end"
                                                sx={{ color: "var(--light-gray)" }}
                                                onChange={handleToggle(value._id)}
                                                checked={checked.includes(value._id)}
                                                inputProps={{ "aria-labelledby": labelId }}
                                            />
                                        }
                                        disablePadding
                                    >
                                        <ListItemButton>
                                            <ListItemAvatar>
                                                <Avatar
                                                    alt={value.name}
                                                    src={value.photos}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText id={labelId} primary={value.name} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                </Box>
            </Modal>
            {/* GrpName chat Modal */}
            <Modal
                open={isChatModalOpen}
                onClose={handleNameClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className="modal-style">
                    <Typography sx={{ textAlign: 'center', color: 'var(--light-gray)' }} id="modal-modal-title" variant="h6"
                    >
                        Enter Chat Name
                    </Typography>
                    <Box
                        id="modal-modal-description" sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <TextField autoComplete='off' sx={{
                            borderRadius: '10px',
                            bgcolor: '#2A3942',

                            '& .MuiOutlinedInput-root': {
                                color: 'white',
                                '& fieldset': {
                                    border: 'none',
                                },
                                '&:hover fieldset': {
                                    border: 'none',
                                },
                                '&.Mui-focused fieldset': {
                                    border: 'none',
                                },
                            },
                            '& .MuiOutlinedInput-input::placeholder': {
                                color: 'grey',
                                opacity: 1,
                            },
                        }} id="outlined-basic" onChange={(e) => setName(e.target.value)} placeholder="Enter Group name" variant="outlined" />
                        <button onClick={handleGrpCreate}>Create Group</button>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};

export default MoreOption;
