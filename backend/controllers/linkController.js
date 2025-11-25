import { generateCode, validateCode, validateUrl } from '../utils/codeUtils.js';
import {
  codeExists,
  createLinkRecord,
  findLinkByCode,
  getAllLinks,
  incrementLinkClick,
  deleteLinkByCode,
  getLinkStats
} from '../models/linkModel.js';

function normalizePayload(req) {
  const url = typeof req.body?.url === 'string' ? req.body.url.trim() : '';
  const customCode = typeof req.body?.customCode === 'string' ? req.body.customCode.trim() : '';
  return { url, customCode };
}

export async function createLink(req, res) {
  const { url, customCode } = normalizePayload(req);

  if (!url || !validateUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  let code = customCode;

  try {
    if (customCode) {
      if (!validateCode(customCode)) {
        return res.status(400).json({ error: 'Custom code must be 6-8 alphanumeric characters' });
      }

      if (await codeExists(customCode)) {
        return res.status(409).json({ error: 'Custom code already taken' });
      }
    } else {
      let attempts = 0;
      let codeLength = 6;

      while (attempts < 10) {
        code = generateCode(codeLength);
        if (!(await codeExists(code))) break;

        attempts += 1;
        if (attempts === 3) codeLength = 7;
        if (attempts === 6) codeLength = 8;
      }

      if (attempts === 10) {
        return res.status(500).json({ error: 'Failed to generate unique code' });
      }
    }

    const newLink = await createLinkRecord(code, url);
    return res.status(201).json(newLink);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Failed to create link' });
  }
}

export async function getLinks(req, res) {
  try {
    const links = await getAllLinks();
    return res.json(links);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ error: 'Failed to fetch links' });
  }
}

export async function handleRedirect(req, res) {
  const { code } = req.params;

  if (!validateCode(code)) {
    return res.status(404).send('Not found');
  }

  try {
    const link = await findLinkByCode(code);

    if (!link) {
      return res.status(404).send('Link not found');
    }

    await incrementLinkClick(code);
    return res.redirect(302, link.url);
  } catch (error) {
    console.error('Redirect error:', error);
    return res.status(500).send('Server error');
  }
}

export async function deleteLink(req, res) {
  const { code } = req.params;

  if (!validateCode(code)) {
    return res.status(404).json({ error: 'Invalid code format' });
  }

  try {
    const deletedLink = await deleteLinkByCode(code);

    if (!deletedLink) {
      return res.status(404).json({ error: 'Link not found' });
    }

    return res.json({ message: 'Link deleted successfully', link: deletedLink });
  } catch (error) {
    console.error('Delete error:', error);
    return res.status(500).json({ error: 'Failed to delete link' });
  }
}

export async function getStats(req, res) {
  const { code } = req.params;

  if (!validateCode(code)) {
    return res.status(404).json({ error: 'Invalid code format' });
  }

  try {
    const link = await getLinkStats(code);

    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }

    return res.json(link);
  } catch (error) {
    console.error('Stats error:', error);
    return res.status(500).json({ error: 'Failed to fetch stats' });
  }
}

