import React, { useState, useRef, useEffect } from "react";
import { Dropdown, FormControl, ListGroup } from "react-bootstrap";

const ConstituencyDropdown = ({
    value,
    onChange,
    placeholder = "Select Constituency",
    className = "",
}) => {
    const constituencies = [
        "Sirpur", "Asifabad (ST)", "Chennur (SC)", "Bellampalli (SC)", "Mancherial",
        "Adilabad", "Boath (ST)", "Nirmal", "Mudhole", "Khanapur (ST)", "Banswada",
        "Armur", "Bodhan", "Nizamabad (Urban)", "Nizamabad (Rural)", "Balkonda",
        "Jukkal (SC)", "Yellareddy", "Kamareddy", "Koratla", "Jagtial", "Dharmapuri (SC)",
        "Ramagundam", "Manthani", "Peddapalle", "Karimnagar", "Choppadandi (SC)",
        "Manakondur (SC)", "Huzurabad", "Vemulawada", "Sircilla", "Zaheerabad (SC)",
        "Sangareddy", "Patancheru", "Narayankhed", "Andole (SC)", "Narsapur", "Medak",
        "Dubbak", "Gajwel", "Husnabad", "Siddipet", "Kalwakurthy", "Shadnagar",
        "Ibrahimpatnam", "Lal Bahadur Nagar", "Maheswaram", "Rajendranagar",
        "Serilingampally", "Chevella (SC)", "Pargi", "Vicarabad (SC)", "Tandur", "Kodangal",
        "Medchal", "Malkajgiri", "Quthbullapur", "Kukatpally", "Uppal", "Musheerabad",
        "Malakpet", "Amberpet", "Khairatabad", "Jubilee Hills", "Sanathnagar", "Nampally",
        "Karwan", "Goshamahal", "Charminar", "Chandrayangutta", "Yakutpura",
        "Bahadurpura", "Secunderabad", "Secunderabad Cantt (SC)", "Mahbubnagar",
        "Jadcherla", "Devarkadra", "Kollapur", "Nagarkurnool", "Achampet (SC)", "Wanaparthy",
        "Gadwal", "Alampur (SC)", "Nakrekal (SC)", "Nalgonda", "Munugode",
        "Devarakonda (ST)", "Nagarjuna Sagar", "Miryalaguda", "Huzurnagar", "Kodad",
        "Suryapet", "Thungathurthi (SC)", "Alair", "Bhongir", "Jangaon",
        "Ghanpur (Station) (SC)", "Palakurthi", "Dornakal (ST)", "Mahabubabad (ST)",
        "Narsampet", "Parkal", "Warangal West", "Warangal East", "Waradhanapet (SC)",
        "Bhupalpalle", "Pinapaka (ST)", "Yellandu (ST)", "Kothagudem", "Aswaraopeta (ST)",
        "Bhadrachalam (ST)", "Khammam", "Palair", "Madhira (SC)", "Wyra (ST)",
        "Sathupalle (SC)", "Mulugu (ST)", "Makthal", "Narayanpet"
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const filtered = constituencies
        .filter((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => a.localeCompare(b));


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={className} style={{ position: "relative" }}>
            <Dropdown
             show={isOpen} 
            //  onToggle={() => setIsOpen(!isOpen)}

             >
                <Dropdown.Toggle
                    // onClick={() => setIsOpen((open) => !open)}
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
                    <div style={{ padding: 8, borderBottom: "1px solid #eee" }}>
                        <FormControl
                            autoFocus
                            placeholder="Search constituency..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            size="sm"
                        />
                    </div>
                    <ListGroup variant="flush" style={{ maxHeight: 200, overflowY: "auto" }}>
                        {filtered.length > 0 ? (
                            filtered.map((c) => (
                                <ListGroup.Item
                                    key={c}
                                    action
                                    active={value === c}
                                    onClick={() => {
                                        onChange(c);
                                        setIsOpen(false);
                                        setSearchTerm("");
                                    }}
                                >
                                    {c}
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

export default ConstituencyDropdown;
