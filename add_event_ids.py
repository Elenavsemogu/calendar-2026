#!/usr/bin/env python3
"""
Add data-event-id to all conference cards
"""
import re

# Mapping of conference titles to event IDs
CONF_MAPPING = {
    'SBC Summit Rio': 'sbc_rio_2026',
    'Affiliate World Dubai': 'affiliate_world_dubai_2026',
    'MAC Yerevan': 'mac_yerevan_2026',
    'SBC Summit Americas': 'sbc_americas_2026',
    'Conversion Conf Warsaw': 'conversion_warsaw_2026',
    'Broconf': 'broconf_sochi_2026',
    'Conversion Conf Kyiv': 'conversion_kyiv_2026',
    'G Gate': 'ggate_tbilisi_2026',
    'iGB L!VE': 'igb_live_2026_london',
    'Conversion Conf Cyprus': 'conversion_cyprus_2026',
    'SBC Summit': 'sbc_lisbon_2026',  # This is Lisbon
    'Global Gaming Expo': 'g2e_las_vegas_2026',
    'AffPapa Conference Madrid': 'affpapa_madrid_2026',
    'AffPapa Conference Cancun': 'affpapa_cancun_2026',
}

def add_event_ids(html_content):
    """Add data-event-id to conference cards."""

    # Pattern to find conference cards
    # Matches both major-card and border-l-2 cards

    for title, event_id in CONF_MAPPING.items():
        # Escape special characters in title for regex
        escaped_title = re.escape(title)

        # Pattern 1: Major cards - find opening div tag and add data-event-id if missing
        pattern1 = rf'(<div class="major-card[^"]*"[^>]*)(data-country="[^"]*">)'

        def add_id_if_needed(match):
            opening_tag = match.group(1)
            closing = match.group(2)

            # Check if this card contains our title
            # We'll need to check ahead in the content
            return opening_tag + closing

        # Better approach: find the card by its title and work backwards to add data-event-id

        # Find position of title
        title_pattern = rf'<(h3|div)[^>]*>({escaped_title})</\1>'
        matches = list(re.finditer(title_pattern, html_content))

        for match in matches:
            title_pos = match.start()

            # Search backwards for the opening <div tag
            search_start = max(0, title_pos - 500)  # Search up to 500 chars back
            substring = html_content[search_start:title_pos]

            # Find the last occurrence of <div class="major-card or <div class="pl-3 border-l-2
            div_pattern = r'<div class="(major-card[^"]*|pl-3 border-l-2[^"]*)"'
            div_matches = list(re.finditer(div_pattern, substring))

            if div_matches:
                last_div = div_matches[-1]
                div_start_in_substring = last_div.start()
                div_start_absolute = search_start + div_start_in_substring

                # Find the end of opening tag (>)
                tag_end = html_content.find('>', div_start_absolute)

                if tag_end != -1:
                    opening_tag = html_content[div_start_absolute:tag_end]

                    # Check if data-event-id already exists
                    if 'data-event-id' not in opening_tag:
                        # Check if this is the right card by checking country code or other attributes
                        # For now, add data-event-id before the closing >

                        # Find position to insert (before the last >)
                        insert_pos = tag_end

                        # Build replacement
                        new_opening_tag = opening_tag + f'\n           data-event-id="{event_id}"'

                        # Replace in content
                        html_content = (
                            html_content[:div_start_absolute] +
                            new_opening_tag +
                            html_content[insert_pos:]
                        )

                        print(f'✓ Added data-event-id="{event_id}" to {title}')

    return html_content

def main():
    # Read HTML
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # Backup
    with open('index.html.backup2', 'w', encoding='utf-8') as f:
        f.write(html)

    # Add event IDs
    updated_html = add_event_ids(html)

    # Write back
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(updated_html)

    print('\n✓ All data-event-id attributes added!')

if __name__ == '__main__':
    main()
