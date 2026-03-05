import { createSupabaseClient } from '../supabase-client-factory';

export interface UserAddressInput {
  type: 'shipping' | 'billing';
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault?: boolean;
}

export class AddressService {
  private supabase: any = null;

  private async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createSupabaseClient();
    }
    return this.supabase;
  }

  /**
   * Get all addresses for a specific user
   */
  async getUserAddresses(userId: string) {
    try {
      const supabase = await this.getSupabaseClient();
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', userId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user addresses:', error);
      throw error;
    }
  }

  /**
   * Get a single address by ID
   */
  async getAddressById(id: string, userId: string) {
    try {
      const supabase = await this.getSupabaseClient();
      const { data, error } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('id', id)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // Ignore not found
      return data;
    } catch (error) {
      console.error('Error fetching address:', error);
      throw error;
    }
  }

  /**
   * Create a new address for a user
   */
  async createAddress(userId: string, input: UserAddressInput) {
    try {
      const supabase = await this.getSupabaseClient();
      
      // If setting as default, unset others of the same type
      if (input.isDefault) {
        await this.unsetOtherDefaults(userId, input.type);
      } else {
        // If this is their first address of this type, make it default automatically
        const existing = await this.getUserAddresses(userId);
        const sameType = existing.filter((a: any) => a.type === input.type);
        if (sameType.length === 0) {
          input.isDefault = true;
        }
      }

      const { data, error } = await supabase
        .from('user_addresses')
        .insert({
          user_id: userId,
          type: input.type,
          first_name: input.firstName,
          last_name: input.lastName,
          company: input.company || null,
          address_line_1: input.addressLine1,
          address_line_2: input.addressLine2 || null,
          city: input.city,
          state: input.state,
          zip_code: input.zipCode,
          country: input.country || 'United States',
          phone: input.phone || null,
          is_default: input.isDefault || false
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  }

  /**
   * Update an existing address
   */
  async updateAddress(id: string, userId: string, input: Partial<UserAddressInput>) {
    try {
      const supabase = await this.getSupabaseClient();

      // If setting as default, unset others of the same type
      if (input.isDefault && input.type) {
        await this.unsetOtherDefaults(userId, input.type, id);
      }

      const updateData: any = {};
      if (input.type !== undefined) updateData.type = input.type;
      if (input.firstName !== undefined) updateData.first_name = input.firstName;
      if (input.lastName !== undefined) updateData.last_name = input.lastName;
      if (input.company !== undefined) updateData.company = input.company;
      if (input.addressLine1 !== undefined) updateData.address_line_1 = input.addressLine1;
      if (input.addressLine2 !== undefined) updateData.address_line_2 = input.addressLine2;
      if (input.city !== undefined) updateData.city = input.city;
      if (input.state !== undefined) updateData.state = input.state;
      if (input.zipCode !== undefined) updateData.zip_code = input.zipCode;
      if (input.country !== undefined) updateData.country = input.country;
      if (input.phone !== undefined) updateData.phone = input.phone;
      if (input.isDefault !== undefined) updateData.is_default = input.isDefault;

      const { data, error } = await supabase
        .from('user_addresses')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  }

  /**
   * Delete an address
   */
  async deleteAddress(id: string, userId: string) {
    try {
      const supabase = await this.getSupabaseClient();
      
      const { error } = await supabase
        .from('user_addresses')
        .delete()
        .eq('id', id)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  }

  /**
   * Set an address as the default for its type
   */
  async setDefaultAddress(id: string, userId: string) {
    try {
      const address = await this.getAddressById(id, userId);
      if (!address) throw new Error('Address not found');

      await this.unsetOtherDefaults(userId, address.type, id);

      const supabase = await this.getSupabaseClient();
      const { data, error } = await supabase
        .from('user_addresses')
        .update({ is_default: true })
        .eq('id', id)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  }

  /**
   * Helper to unset is_default on other addresses of the same type
   */
  private async unsetOtherDefaults(userId: string, type: string, excludeId?: string) {
    try {
      const supabase = await this.getSupabaseClient();
      let query = supabase
        .from('user_addresses')
        .update({ is_default: false })
        .eq('user_id', userId)
        .eq('type', type)
        .eq('is_default', true);

      if (excludeId) {
        query = query.neq('id', excludeId);
      }

      await query;
    } catch (error) {
      console.error('Error unsetting other defaults:', error);
    }
  }
}

// Export singleton instance
export const addressService = new AddressService();
