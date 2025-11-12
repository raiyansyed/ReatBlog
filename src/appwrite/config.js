import conf from "../conf/conf.js";
import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      console.log("🔧 createPost called with:", { title, slug, content, featuredImage, status, userId });
      console.log("📍 Using database:", conf.appwriteDatabaseId);
      console.log("📍 Using collection:", conf.appwriteCollectionId);
      
      // Use ID.unique() if slug is empty/invalid
      const documentId = slug && slug.trim() ? slug : ID.unique();
      console.log("🆔 Document ID:", documentId);

      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        documentId,
        {
          title,
          slug: slug || documentId,
          content,
          featuredImage,
          status,
          authorId: userId, // Renamed from userId to authorId
        }
      );
    } catch (error) {
      console.error("❌ Appwrite createPost error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        type: error.type,
        response: error.response
      });
      throw error;
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Error occured in appwrite", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
      return true;
    } catch (error) {
      console.log("Error occured in appwrite", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Error occured in appwrite", error);
      return false;
    }
  }

  async getPosts(queries = []) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite getPosts error:", error);
      return null;
    }
  }

  // file upload services

  async uploadFile(file, { publicRead = true } = {}) {
    try {
      console.log("📤 Uploading file:", file?.name, "Size:", file?.size);
      console.log("🪣 Using bucket:", conf.appwriteBucketId);
      const permissions = [];
      if (publicRead) {
        permissions.push(Permission.read(Role.any()));
      }

      const result = await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
        permissions
      );
      
      console.log("✅ File uploaded successfully:", result);
      return result;
    } catch (error) {
      console.error("❌ Appwrite uploadFile error:", error);
      console.error("Error details:", {
        message: error.message,
        code: error.code,
        type: error.type,
        response: error.response
      });
      return null;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Error occured in appwrite", error);
      return false;
    }
  }

  /**
   * Get a preview URL for an image stored in Appwrite Storage.
   * Supports both older and newer JS SDKs which may return either a string or a URL object.
   * Falls back to null on error so callers can provide a local placeholder (no network spam).
   *
   * @param {string} fileId The Appwrite file ID
   * @param {object} options Optional preview options: { width, height, gravity, quality, borderRadius, borderColor, background, output }
   * @returns {string|null} A URL string or null when unavailable
   */
  getFilePreview(fileId, options = {}) {
    if (!fileId) return null;
    try {
      const {
        width = 1200,
        height = 0,
        gravity = 'center',
        quality = 90,
        borderRadius,
        borderColor,
        background,
        output,
      } = options;

      // Appwrite JS SDK getFilePreview signature (as of v13+):
      // getFilePreview(bucketId, fileId, width?, height?, gravity?, quality?, borderRadius?, borderColor?, background?, output?)
      const result = this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId,
        width,
        height,
        gravity,
        quality,
        borderRadius,
        borderColor,
        background,
        output
      );

      // Some SDK versions return URL, others string
      return typeof result === 'string' ? result : (result?.href || result?.toString?.() || null);
    } catch (error) {
      console.error('❌ getFilePreview failed:', error);
      return null;
    }
  }

  /**
   * Get a direct view URL (useful for non-image files)
   */
  getFileView(fileId) {
    if (!fileId) return null;
    try {
      const result = this.bucket.getFileView(conf.appwriteBucketId, fileId);
      return typeof result === 'string' ? result : (result?.href || result?.toString?.() || null);
    } catch (error) {
      console.error('❌ getFileView failed:', error);
      return null;
    }
  }
}

const service = new Service();

export default service;
