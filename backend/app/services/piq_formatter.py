from typing import Optional, Any
import json
from app.models.models import PIQProfile

def format_piq_to_markdown(piq: Optional[PIQProfile]) -> str:
    """
    Formats a candidate's PIQProfile object into a high-density, structured 
    Markdown context block to feed into LLM system prompt for PIQ-aware coaching.
    """
    if not piq:
        return "No PIQ Profile data found for candidate."

    lines = []
    lines.append("=== CANDIDATE PERSONAL INFORMATION QUESTIONNAIRE (PIQ) PROFILE ===")

    # 1. Administrative & Basic Details
    admin_info = []
    if piq.full_name:
        admin_info.append(f"Full Name: {piq.full_name}")
    if piq.date_of_birth:
        admin_info.append(f"Date of Birth: {piq.date_of_birth}")
    if piq.age_years is not None:
        admin_info.append(f"Age: {piq.age_years} yrs {piq.age_months or 0} mos")
    if piq.state_district:
        admin_info.append(f"State/District: {piq.state_district}")
    if piq.religion:
        admin_info.append(f"Religion: {piq.religion}")
    if piq.category:
        admin_info.append(f"Category: {piq.category}")
    if piq.mother_tongue:
        admin_info.append(f"Mother Tongue: {piq.mother_tongue}")
    if piq.marital_status:
        admin_info.append(f"Marital Status: {piq.marital_status}")
    if piq.height:
        admin_info.append(f"Height: {piq.height} m")
    if piq.weight:
        admin_info.append(f"Weight: {piq.weight} kg")

    if admin_info:
        lines.append("## Personal & Demographic Details:")
        lines.append(" | ".join(admin_info))

    if piq.selection_board or piq.batch_no or piq.chest_no or piq.upsc_roll_no:
        ssb_admin = []
        if piq.selection_board: ssb_admin.append(f"Board: {piq.selection_board}")
        if piq.batch_no: ssb_admin.append(f"Batch No: {piq.batch_no}")
        if piq.chest_no: ssb_admin.append(f"Chest No: {piq.chest_no}")
        if piq.upsc_roll_no: ssb_admin.append(f"UPSC Roll No: {piq.upsc_roll_no}")
        lines.append("## SSB Admin Info:")
        lines.append(" | ".join(ssb_admin))

    # 2. Residence Details
    residences = []
    if piq.max_residence and isinstance(piq.max_residence, dict):
        place = piq.max_residence.get("place", "")
        pop = piq.max_residence.get("population", "")
        if place: residences.append(f"Maximum Residence: {place} (Pop: {pop})")
    if piq.parents_residence and isinstance(piq.parents_residence, dict):
        place = piq.parents_residence.get("place", "")
        pop = piq.parents_residence.get("population", "")
        if place: residences.append(f"Parents Residence: {place} (Pop: {pop})")
    if piq.permanent_residence and isinstance(piq.permanent_residence, dict):
        place = piq.permanent_residence.get("place", "")
        pop = piq.permanent_residence.get("population", "")
        if place: residences.append(f"Permanent Residence: {place} (Pop: {pop})")

    if residences:
        lines.append("## Residence Details:")
        for r in residences:
            lines.append(f"- {r}")

    # 3. Family Details
    lines.append("## Family Background:")
    if piq.father_name:
        lines.append(f"Father's Name: {piq.father_name}")
    if piq.parents_alive is not None:
        lines.append(f"Parents Alive: {'Yes' if piq.parents_alive else 'No'}")

    if piq.family_members and isinstance(piq.family_members, list):
        fam_list = []
        for member in piq.family_members:
            rel = member.get("relation", "")
            edu = member.get("education", "")
            occ = member.get("occupation", "")
            inc = member.get("income", "")
            if rel:
                fam_list.append(f"- {rel}: Education={edu}, Occupation={occ}, Income={inc}")
        if fam_list:
            lines.append("Family Members:")
            lines.extend(fam_list)

    # 4. Academic Records
    if piq.academic_records and isinstance(piq.academic_records, list):
        lines.append("## Academic Qualifications:")
        acad_lines = []
        for rec in piq.academic_records:
            qual = rec.get("qualification", "")
            inst = rec.get("institution", "")
            year = rec.get("year", "")
            marks = rec.get("division_marks", "")
            med = rec.get("medium", "")
            bd = rec.get("boarder_day", "")
            achiv = rec.get("achievement", "")
            if qual:
                line = f"- {qual}: {inst} ({year}), Marks: {marks}, Medium: {med}, Type: {bd}"
                if achiv:
                    line += f", Achievement: {achiv}"
                acad_lines.append(line)
        if acad_lines:
            lines.extend(acad_lines)

    # 5. Present Occupation & Income
    if piq.present_occupation or piq.monthly_income:
        occ_info = []
        if piq.present_occupation: occ_info.append(f"Occupation: {piq.present_occupation}")
        if piq.monthly_income: occ_info.append(f"Monthly Income: {piq.monthly_income}")
        lines.append("## Present Occupation:")
        lines.append(" | ".join(occ_info))

    # 6. NCC Details
    if piq.ncc_training is not None:
        lines.append(f"## NCC Training: {'Yes' if piq.ncc_training else 'No'}")
        if piq.ncc_details and isinstance(piq.ncc_details, list):
            for ncc in piq.ncc_details:
                wing = ncc.get("wing", "")
                cert = ncc.get("certificate", "")
                total = ncc.get("total_training", "")
                lines.append(f"- Wing: {wing}, Total Training: {total}, Certificate: {cert}")

    # 7. Sports, Hobbies, Extracurricular & Responsibilities
    lines.append("## Sports, Hobbies & Activities:")
    if piq.sports and isinstance(piq.sports, list):
        sports_lines = []
        for sp in piq.sports:
            game = sp.get("game", "")
            dur = sp.get("duration", "")
            rep = sp.get("represented", "")
            ach = sp.get("achievement", "")
            if game:
                sports_lines.append(f"- Game: {game}, Duration: {dur}, Represented: {rep}, Achievement: {ach}")
        if sports_lines:
            lines.append("Sports Participated:")
            lines.extend(sports_lines)

    if piq.hobbies:
        lines.append(f"Hobbies & Interests: {piq.hobbies}")

    if piq.extracurricular and isinstance(piq.extracurricular, list):
        extra_lines = []
        for ex in piq.extracurricular:
            act = ex.get("activity_group", "")
            dur = ex.get("duration", "")
            ach = ex.get("achievement", "")
            if act:
                extra_lines.append(f"- Activity: {act}, Duration: {dur}, Achievement: {ach}")
        if extra_lines:
            lines.append("Extra-Curricular Activities:")
            lines.extend(extra_lines)

    if piq.responsibility_positions:
        lines.append(f"Positions of Responsibility Held: {piq.responsibility_positions}")

    # 8. Commission Choice & Previous SSB Attempts
    lines.append("## Service Choice & SSB Attempt History:")
    if piq.nature_of_commission:
        lines.append(f"Nature of Commission: {piq.nature_of_commission}")
    if piq.choice_of_service:
        lines.append(f"Choice of Service: {piq.choice_of_service}")
    if piq.commission_attempts is not None:
        lines.append(f"Total Previous SSB Attempts: {piq.commission_attempts}")

    if piq.previous_interviews and isinstance(piq.previous_interviews, list):
        att_lines = []
        for prev in piq.previous_interviews:
            sl = prev.get("sl_no", "")
            entry = prev.get("type_of_entry", "")
            place = prev.get("ssb_place", "")
            dt = prev.get("date", "")
            batch = prev.get("chest_batch_no", "")
            res = prev.get("result", "")
            if entry or place:
                line = f"- Attempt {sl}: Entry={entry}, Center={place}, Date={dt}, Batch={batch}"
                if res:
                    line += f", Result={res}"
                att_lines.append(line)
        if att_lines:
            lines.append("Previous SSB Interview Records:")
            lines.extend(att_lines)

    if piq.exam or piq.level:
        lines.append(f"Target Exam: {piq.exam or 'SSB'} | Preparation Level: {piq.level or 'Intermediate'}")

    lines.append("=================================================================")
    return "\n".join(lines)
