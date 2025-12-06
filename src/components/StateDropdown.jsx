import React, { useState, useRef, useEffect } from "react";
import { Dropdown, FormControl, ListGroup } from "react-bootstrap";

const StateDropdown = ({ value, onChange, list, placeholder = "Select State" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef(null);

    const filtered = list
        .filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => a.name.localeCompare(b.name));

    useEffect(() => {
        const close = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    return (
        <div ref={ref} style={{ position: "relative", width: "100%" }}>
            <Dropdown show={isOpen}>
                <Dropdown.Toggle
                    onClick={() => setIsOpen(!isOpen)}
                    className="border border-primary rounded-1"
                    style={{ width: "100%" }}
                >
                    {value?.name || placeholder}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "100%", padding: 0 }}>
                    <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                        <FormControl
                            autoFocus
                            placeholder="Search state..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <ListGroup style={{ maxHeight: 200, overflowY: "auto" }}>
                        {filtered.map((s) => (
                            <ListGroup.Item
                                key={s.iso2}
                                action
                                onClick={() => {
                                    onChange(s);
                                    setIsOpen(false);
                                    setSearch("");
                                }}
                            >
                                {s.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

export default StateDropdown;
