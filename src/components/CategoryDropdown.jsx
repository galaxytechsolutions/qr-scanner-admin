import React, { useState, useRef, useEffect } from "react";
import { Dropdown, FormControl, ListGroup } from "react-bootstrap";

const CategoryDropdown = ({
    value,
    onChange,
    placeholder = "Select Category",
    className = "",
}) => {
    
    const categories = [
        "Agriculture, Rural & Environment",
        "Housing & Shelter / Welfare",
        "Health & Wellness",
        "Skills, Employment & Financial Services",
        "Business & Entrepreneurship"
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const filtered = categories
        .filter((cat) => cat.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={className} style={{ position: "relative" }}>
            <Dropdown show={isOpen}>
                <Dropdown.Toggle
                    onClick={(e) => {
                        e.preventDefault();
                        setIsOpen((open) => !open);
                    }}
                    type="button"
                    variant="light"
                    className="border border-primary rounded-1"
                    style={{ width: "100%" }}
                >
                    {value || placeholder}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "100%", padding: 0 }}>
                    {/* Search Input */}
                    <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                        <FormControl
                            autoFocus
                            placeholder="Search category..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="sm"
                        />
                    </div>

                    {/* Category List */}
                    <ListGroup variant="flush" style={{ maxHeight: 200, overflowY: "auto" }}>
                        {filtered.length > 0 ? (
                            filtered.map((cat) => (
                                <ListGroup.Item
                                    key={cat}
                                    action
                                    active={value === cat}
                                    onClick={() => {
                                        onChange(cat);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    {cat}
                                </ListGroup.Item>
                            ))
                        ) : (
                            <ListGroup.Item disabled style={{ color: "#888" }}>
                                No results found
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default CategoryDropdown;
