import re
import json

samples = [
    """Construction of New Domestic Terminal Building Building and miscellaneous works
including maintenance, operations and AICMC at Kadapa Airport
(Airport Authority of India [AAI])
(612786)
(N04000106) (-)""",
    """Construction of New Integrated Terminal Building and associated works including
apron to park 3 code E type of aircraft or 6 code C type of aircraft at Vijayawada
Airport.
(Airport Authority of India [AAI])
(701107)
(N04000091) (4353)""",
    """Modernization of Chennai Airport, Phase II, Part 2
(Airport Authority of India [AAI])
(611602)
(-) (5163)""",
    """MUMBAI-AHMEDABAD HIGH SPEED RAIL PROJECT- 508 KM
(NHSRCL)
(705728)
(N02000001) (1234)""",
    """WESTERN DEDICATED FREIGHT CORRIDOR
(DFCCIL)
(705237)
(N02000002) (2345)"""
]

def parse_col1(col1_text):
    lines = [l.strip() for l in col1_text.strip().split('\n') if l.strip()]
    if not lines:
        return {'project_name': '', 'agency': '', 'project_code': '', 'legacy_ocms_code': '', 'pmgid': ''}
        
    # Find all parenthesized tokens at the end
    agency = ""
    project_code = ""
    legacy_ocms_code = ""
    pmgid = ""
    
    # We can match code line like (612786) or (N04000106) (4353) or (-) (5163)
    # Extract agency
    agency_match = re.search(r'\(([^)]*(?:Authority|Limited|Ltd|Corporation|Railways|NHAI|AAI|ECL|BCCL|SECL|WCL|CCL|CIL|NLCIL|NCL|DFCCIL|NHSRCL|RVNL|KRCL|CPWD|Ministry|Department|SECL|NEEPCO|NTPC|NHPC|PGCIL|IOCL|BPCL|HPCL|ONGC|OIL|GAIL|MRPL|NRL|BRPL|CPCL|RCF|FACT|BHEL|SAIL|NMDC|MOIL|KIOCL|NALCO|HCL|Cochin Shipyard|Syama Prasad Mookerjee|Jawaharlal Nehru Port|Chennai Port|V.O.Chidambaranar|Paradip Port|Deendayal Port|Visakhapatnam Port|Mormugao Port|Mumbai Port|Kolkata Port|Kamrajar Port|Irrigation|PWD)[^)]*)\)', col1_text, re.IGNORECASE)
    
    if agency_match:
        agency = agency_match.group(1).strip()
    
    # Find project code (usually a 6-digit number in parentheses, e.g. (612786), (701107))
    code_matches = re.findall(r'\((\d{6})\)', col1_text)
    if code_matches:
        project_code = code_matches[0]
        
    # Find legacy OCMS code (e.g. (N04000106), (N02000001))
    ocms_matches = re.findall(r'\(([A-Z]\d{8})\)', col1_text)
    if ocms_matches:
        legacy_ocms_code = ocms_matches[0]
        
    # Find PMGID (e.g. (4353), (5163), (11856), (9931))
    pmgid_matches = re.findall(r'\((?:[A-Z0-9-]+\s+)?(\d{3,5})\)', col1_text)
    for pm in pmgid_matches:
        if pm != project_code:
            pmgid = pm
            break
            
    # Extract project name: everything before the first parenthesized metadata line
    name_lines = []
    for line in lines:
        if line.startswith('(') and (agency in line or project_code in line or legacy_ocms_code in line or '-' in line):
            break
        name_lines.append(line)
        
    project_name = " ".join(name_lines).strip()
    return {
        'project_name': project_name,
        'agency': agency,
        'project_code': project_code,
        'legacy_ocms_code': legacy_ocms_code,
        'pmgid': pmgid
    }

for s in samples:
    print(json.dumps(parse_col1(s), indent=2))
    print("-" * 40)
